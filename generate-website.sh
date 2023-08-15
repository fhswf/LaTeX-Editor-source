#!/bin/bash
# ==============================================================================
#
#          FILE: generate-website.sh
#
#         USAGE: ./generate-website.sh TARGET REPO [DOMAIN]
#
#   DESCRIPTION: This script is executed by the github action to generate a
#                website from the latex templates.
#
#       OPTIONS: TARGET   target directory
#                REPO     name of remote repository, 'user/repository'
#                DOMAIN   github custom domain (optional)
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Fabian Eberts
#  ORGANIZATION: ---
#       CREATED: ---
#      REVISION: ---
#
# ==============================================================================

DEBUG=0

# For local debugging run: ./generate-website.sh remote_temp user/repo cname_entry
# This creates the web application in a local directory.

function fatal
{
    printf "$0: error: $1\n"
    exit 1
}

function debug
{
    ((DEBUG)) && printf "$1\n"
    return
}

# ------------------------------------------------------------------------------
#  arguments
# ------------------------------------------------------------------------------

TARGET="$1"/ # remote repository root directory
REPO="$2"    # remote repository name
DOMAIN="$3"  # remote repository github pages custom domain (optional)

[ $# -lt 2 ] && fatal "too few arguments"

# ------------------------------------------------------------------------------
#  variables
# ------------------------------------------------------------------------------

DOCS="$TARGET"/docs/ # remote repository web document root
TEMPLATES=templates/ # local latex templates
WEB=web/             # local website template
SWIFT=swiftlatex/    # local swiftlatex modules

# ------------------------------------------------------------------------------
#  generate website
# ------------------------------------------------------------------------------

((DEBUG)) && rm -rf "$TARGET" &>/dev/null && mkdir "$TARGET"

# add text to the configuration file
function add_to_config
{
    printf "$1" >> "$DOCS"/"$template_name"/config.js
}

# add text to the readme file
function add_to_readme
{
    printf "$1" >> "$TARGET"/README.md
}

# remove the path from a filename
function strip_path
{
    printf "${1##*/}"
}

# copy latex templates to html document root:
mkdir "$DOCS"
cp -r "$TEMPLATES"/* "$DOCS"/

# create readme:
add_to_readme "# LaTeX-Vorlagen\n\n"
URL="$(echo "$REPO" | sed 's/\//.github.io\//g')"

# generate website for each latex template:
for template_dir in "$TEMPLATES"/*/ # only directories
do
    debug "Directory: '$template_dir'"

    # ---------- write configuration file ----------

    # template name:
    template_name="${template_dir%/}" # strip trailing slash
    template_name="$(strip_path "$template_name")"
    debug "    Template name: '$template_name'"
    add_to_config 'const config_template_name = "'"$template_name"'";'"\n"

    # main tex file (contains '\documentclass'):
    main_tex_file="$(grep -rl --fixed-strings '\documentclass' "$template_dir")"
    main_tex_file="$(strip_path "$main_tex_file")"
    debug "    Main tex file: '$main_tex_file'"
    add_to_config 'const config_main_tex_file = "'"$main_tex_file"'";'"\n"

    # project files:
    add_to_config 'const config_project_files = ['
    debug "    Project files:"

    for file in "$template_dir"*.* # only files
    do
        file_name="$(strip_path "$file")"

        # do not include compiled pdfs:
        main_pdf="${main_tex_file%.tex}".pdf
        [[ "$file_name" == "$main_pdf" ]] && continue

        # add to config:
        debug "        '$file_name'"
        add_to_config '"'"$file_name"'",'
    done

    add_to_config "];\n"

    # placeholders:
    placeholders=($(grep -E --only-matching "{{[^{}]+}}" "$template_dir"/"$main_tex_file" | sed 's/ /§/g' | sed 's/[{}]//g'))
    add_to_config 'const config_placeholders = ['
    debug "    Placeholders: "

    for placeholder in "${placeholders[@]}"
    do
        placeholder="$(echo "$placeholder" | sed 's/§/ /g')"
        add_to_config '"'"$placeholder"'",'
        debug "        '$placeholder'"
    done

    add_to_config "];\n"

    # ---------- copy website files ----------

    cp -r "$WEB"/* "$DOCS"/"$template_name"/
    cp -r "$SWIFT"/* "$DOCS"/"$template_name"/

    # ---------- add markdown link to readme ----------

    TEMPLATE_URL="$(echo "$URL"/"$template_name")"
    debug "    Link: $TEMPLATE_URL"
    add_to_readme "* **${template_name}:** [${TEMPLATE_URL}](http://${TEMPLATE_URL})\n"
done

# ------------------------------------------------------------------------------
#  create CNAME file
# ------------------------------------------------------------------------------

if [ -n "$DOMAIN" ]
then
    echo -n "$DOMAIN" > "$DOCS"/CNAME
fi

# ------------------------------------------------------------------------------
#  copy latex templates to a seperate directory
# ------------------------------------------------------------------------------

# Tehnically this is NOT neccessary. It only makes it easier to download a tenplate without having to use the web frontend.

cp -r "$TEMPLATES" "$TARGET"/Vorlagen
