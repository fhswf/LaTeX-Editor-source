// =============================================================================
//
//          FILE: editor.js
//
//         USAGE: ---
//   DESCRIPTION: This file contains functions that load the swiftlatex engine,
//                initialize the code editor, compile the latex document and
//                display the pdf.
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

// -----------------------------------------------------------------------------
//  element access
// -----------------------------------------------------------------------------

const compile_button = document.getElementById("compilebutton");
const tex_console = document.getElementById("texconsole");
const console_output = document.getElementById("texconsoleoutput");
const pdfviewer = document.getElementById("pdfviewer");
const templatename = document.getElementById("templatename");
const message = document.getElementById("message");

// -----------------------------------------------------------------------------
//  constants and variables
// -----------------------------------------------------------------------------

const editor = ace.edit("editor");
var uploads = [];
var compile_first_time = true;

// -----------------------------------------------------------------------------
//  initialize frontend
// -----------------------------------------------------------------------------

/*
 * initialize html
 */
async function init_html()
{
    templatename.innerHTML = 'Vorlage „' + config_template_name + '“';
}

/*
 * initialize the editor
 */
async function init_editor()
{
    // basic setup:
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/latex");
    editor.session.setUseWrapMode(true);
    editor.setFontSize(16);
    editor.setShowPrintMargin(false);

    // read text from latex main file:
    var text = await fetch(config_main_tex_file);
    text = await text.text();

    // replace placeholders with form data:
    placeholder_map.forEach(function(user_input, placeholder)
    {
        placeholder = placeholder.replaceAll('_', '\\'); // demask backslashes
        console.log('placeholder: ' + placeholder + ' = ' + user_input);
        text = text.replaceAll('{{' + placeholder + '}}', user_input);
    })

    // paste text into editor and make editor visible:
    set_editor_text(text);
    document.getElementById("latex").style.display = "block";
}

/*
 * add text to editor
 */
async function set_editor_text(text)
{
    await editor.setValue(text);
    await editor.clearSelection();
}

// -----------------------------------------------------------------------------
//  swiftlatex
// -----------------------------------------------------------------------------

const engine = new PdfTeXEngine();

/*
 * add latex files as specified in the config file to the swiftlatex engine
 */
async function add_projectfiles_to_engine()
{
    console.log("add files to engine:");

    for(const file of config_project_files)
    {
        await add_file(file);
    }

    set_main_tex_file();
}

/*
 * generic function to add a file to the engine
 */
async function add_file(filename)
{
    if(/^.+\.(tex|bib|sty|cls)$/.test(filename))
    {
        await add_text(filename);
        console.log(filename + " added as text");
    }
    else
    {
        await add_image(filename);
        console.log(filename + " added as image");
    }
}

/*
 * add a text based file to the engine
 */
async function add_text(filename)
{
    let text = await fetch(filename);
    text = await text.text();
    engine.writeMemFSFile(filename, text);
}

/*
 * add a binary file to the engine
 */
async function add_image(filename)
{
    let blob = await fetch(filename);
    blob = await blob.arrayBuffer();
    engine.writeMemFSFile(filename, new Uint8Array(blob));
}

/*
 * set main tex file
 */
async function set_main_tex_file()
{
    await engine.setEngineMainFile(config_main_tex_file);
    console.log(config_main_tex_file + " set as main file");
}

/*
 * initialize the tex engine
 */
async function init_engine()
{
    // load engine and add files:
    await engine.loadEngine();
    engine.setTexliveEndpoint(TEXLIVE_SERVER);
    await add_projectfiles_to_engine();

    // enable compile button:
    compile_button.innerHTML = "Compile";
    compile_button.disabled = false;
}

/*
 * compile document and display pdf
 */
async function compile()
{
    close_forms();

    if(!engine.isReady())
    {
        console.log("engine is not ready");
        return;
    }

    // disable compile button during compilation:
    compile_button.disabled = true;
    compile_button.innerHTML = "Compiling ...";

    // pass editor text to engine, then compile:
    var editor_text = editor.getValue();
    editor_text = editor_text.replaceAll('backend=biber', 'backend=bibtex'); // because swiftlatex does not support biber
    engine.writeMemFSFile(config_main_tex_file, editor_text);

    // compile document:
    let result;

    if(compile_first_time)
    {
        message.innerHTML = '<p style="color: green;">Beim ersten Mal dauert dies eine Weile, da einige LaTeX-Pakete geladen werden müssen.</p>';
        message.style.display = "block";

        // compile multiple times to get references and bibliography right:
        result = await engine.compileLaTeX();
        result = await engine.compileLaTeX();
        result = await engine.compileLaTeX();
        result = await engine.compileLaTeX();

        compile_first_time = false;
        message.style.display = "none";
    }
    else
    {
        result = await engine.compileLaTeX();
    }

    // display pdftex console output:
    console_output.innerHTML = result.log;
    tex_console.style.display = "block"; // make element visible

    // make compile button visible again:
    compile_button.innerHTML = "Compile";
    compile_button.disabled = false;

    // if compiled successfully, display pdf:
    if(result.status === 0)
    {
        const pdfblob = new Blob([result.pdf], { type : 'application/pdf' });
        const objectURL = URL.createObjectURL(pdfblob);
        setTimeout(()=>{ URL.revokeObjectURL(objectURL); }, 30000);
        pdfviewer.innerHTML = `<embed src="${objectURL}" id="pdfviewerinner" type="application/pdf">`;
    }
    else
    {
        pdfviewer.innerHTML = ''; // close pdf viewer
    }
}

// -----------------------------------------------------------------------------
//  initialization
// -----------------------------------------------------------------------------

// if no placeholders were found, skip form and load editor immediately:
if(config_placeholders.length === 0)
{
    load_editor();
}

/*
 * initialize all components; this function gets called, when the html is loaded
 */
async function init()
{
    await init_html();
    await init_editor();
    await init_engine();
}
