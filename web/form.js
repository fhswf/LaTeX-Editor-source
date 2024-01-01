// =============================================================================
//
//          FILE: form.js
//
//         USAGE: ---
//   DESCRIPTION: This file contains functions to generate the input form for
//                placeholders and to handle the submitted data.
//
//       OPTIONS: ---
//  REQUIREMENTS: ---
//          BUGS: ---
//         NOTES: ---
//        AUTHOR: Fabian Eberts
//  ORGANIZATION: ---
//       CREATED: ---
//      REVISION: ---
//
// =============================================================================

const placeholder_map = new Map();
let placeholders_found = true;

/*
 * print form for entering placeholders
 */
function print_form()
{
    document.write('<form action="javascript:form_handler()" id="placeholderform">');

    // generate input fields:
    for(const ph of config_placeholders)
    {
        let ph_text = ph.replaceAll('_', '\\'); // demask backslashes

        if(/^.+ $/.test(ph)) // text area input (string ends with whitespace)
        {
            console.log("form: textarea");
            ph_text = ph_text.replaceAll(/ $/g, ''); // remove trailing whitespace
            ph_text = ph_text.replaceAll(/\\\\ */g, '\\\\\n'); // add line breaks
            document.write('<textarea name="' + ph + '" rows="5" required>' + ph_text + '</textarea><br><br>');
        }
        else // line input
        {
            console.log("form: text");
            document.write('<input type="text" name="' + ph + '" value="' + ph_text + '" required><br><br>');
        }
    }

    document.write('<input type="submit" value="Continue">');
    document.write('</form>');
}

/*
 * read form data and store it in a map, then load the code editor
 */
function form_handler()
{
    for(const ph of config_placeholders)
    {
        placeholder_map.set(ph, document.getElementsByName(ph)[0].value);
    }

    load_editor();
}

/*
 * remove form from DOM and load editor
 */
function load_editor()
{
    document.getElementById("form").remove();
    init();
}
