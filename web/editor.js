// =============================================================================
//
//          FILE: editor.js
//
//         USAGE: ---
//   DESCRIPTION: This file provides functions that load the swiftlatex engine,
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

// -----------------------------------------------------------------------------
//  variables
// -----------------------------------------------------------------------------

const editor = ace.edit("editor");
const uploads = [];

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
    const response = await fetch(config_main_tex_file);
    var text = await response.text();

    // replace placeholders with form data:
    placeholder_map.forEach(function(user_input, placeholder)
    {
        console.log('placeholder: ' + placeholder + ' = ' + user_input);
        text = text.replaceAll('{{' + placeholder + '}}', user_input);
    })

    // paste text into editor:
    await editor.setValue(text);
    await editor.clearSelection();

    // make editor visible:
    document.getElementById("latex").style.display = "block";
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

    await engine.setEngineMainFile(config_main_tex_file);
    console.log(config_main_tex_file + " set as main file");
}

/*
 * generic function to add files to the engine
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
    let raw = await fetch(filename);
    let text = await raw.text();
    engine.writeMemFSFile(filename, text);
}

/*
 * add an image file to the engine
 */
async function add_image(filename)
{
    let raw = await fetch(filename);
    let blob = await raw.arrayBuffer();
    engine.writeMemFSFile(filename, new Uint8Array(blob));
}

/*
 * initialize the tex engine
 */
async function init_latex()
{
    await engine.loadEngine();
    engine.setTexliveEndpoint("http://tex.feb-dev.net:4711/");
    await add_projectfiles_to_engine();

    // enable compile button:
    compile_button.innerHTML = "Kompilieren";
    compile_button.disabled = false;
}

var compile_first_time = true;

/*
 * compile document and display pdf
 */
async function compile()
{
    if(!engine.isReady())
    {
        console.log("engine is not ready");
        return;
    }

    // disable compile button during compilation:
    compile_button.disabled = true;
    compile_button.innerHTML = "Kompiliert ...";

    // pass editor text to engine, then compile:
    var editor_text = editor.getValue();
    editor_text = editor_text.replaceAll('backend=biber', 'backend=bibtex'); // because swiftlatex does not support biber
    engine.writeMemFSFile(config_main_tex_file, editor_text);

    // compile document:
    let result = await engine.compileLaTeX();

    if(compile_first_time)
    {
        // get references and bibliography right:
        result = await engine.compileLaTeX();
        result = await engine.compileLaTeX();
        compile_first_time = false;
    }

    // display compile run console output:
    console_output.innerHTML = result.log;
    tex_console.style.display = "block"; // make element visible

    // make compile button visible again:
    compile_button.innerHTML = "Kompilieren";
    compile_button.disabled = false;

    // if compilation successful, display pdf:
    if(result.status === 0)
    {
        const pdfblob = new Blob([result.pdf], { type : 'application/pdf' });
        const objectURL = URL.createObjectURL(pdfblob);
        setTimeout(()=>{ URL.revokeObjectURL(objectURL); }, 30000);
        console.log(objectURL);
        pdfviewer.innerHTML = `<embed src="${objectURL}" id="pdfviewerinner" type="application/pdf">`;
    }
}

// -----------------------------------------------------------------------------
//  initialization
// -----------------------------------------------------------------------------

// if no placeholders were found, load editor immediately:
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
    await init_latex();
}
