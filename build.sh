#!/bin/bash
# ==============================================================================
#
#          FILE: generate-website.sh
#
#         USAGE: ./generate-website.sh TARGET REPO [DOMAIN]
#
#   DESCRIPTION: This script is executed by the github workflow to generate a
#                website from the latex templates.
#
#       OPTIONS: TARGET   temporary target directory
#                REPO     remote repository name ('user/repository')
#                DOMAIN   github pages custom domain (optional)
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
# for local debugging run literally:
#   ./generate-website.sh remote_temp user/repo cname_entry
# this will create the web application in a local directory named remote_temp

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

TARGET="$1"/ # temporary target directory
REPO="$2"    # remote repository name
DOMAIN="$3"  # remote repository github pages custom domain (optional)

[ $# -lt 2 ] && fatal "too few arguments"

# ------------------------------------------------------------------------------
#  variables
# ------------------------------------------------------------------------------

DOCS="$TARGET"/docs/ # web document root
TEMPLATES=templates/ # latex templates
WEB=web/             # website template
SWIFT=swiftlatex/    # swiftlatex modules
LATEXINSTALL=LaTeX-Install.md

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
    add_to_config 'var config_template_name = "'"$template_name"'";'"\n"

    # main tex file (contains '\documentclass'):
    main_tex_file="$(grep -rl --fixed-strings --include *.tex '\documentclass' "$template_dir")"
    main_tex_file="$(strip_path "$main_tex_file")"
    debug "    Main tex file: '$main_tex_file'"
    add_to_config 'var config_main_tex_file = "'"$main_tex_file"'";'"\n"

    # project files:
    add_to_config 'var config_project_files = ['
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
    # mask spaces before creating the array
    placeholders=($(grep -E --only-matching "{{[^{}]+}}" "$template_dir"/"$main_tex_file" \
        | sed 's/ /§/g' \
        | sed 's/[{}]//g'))
    add_to_config 'var config_placeholders = ['
    debug "    Placeholders: "

    for placeholder in "${placeholders[@]}"
    do
        # demask spaces, then mask backslashes:
        placeholder="$(echo "$placeholder" | sed 's/§/ /g' | sed -E 's/\\/_/g')"
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

# Technically this is NOT necessary. It only makes it easier to download a template without having to use the web frontend.

cp -r "$TEMPLATES" "$TARGET"/Vorlagen

# remove placeholder syntax elements (curly braces):
find "$TARGET"/Vorlagen -type f -name *.tex | xargs sed -i -E 's/\{\{([^{}]+)\}\}/\1/g'

# ------------------------------------------------------------------------------
#  copy install instructions
# ------------------------------------------------------------------------------

cp "$LATEXINSTALL" "$TARGET"
add_to_readme "\nAnleitung für die lokale Installation von LaTeX auf dem PC: [${LATEXINSTALL}](./${LATEXINSTALL})\n"
