// =============================================================================
//
//          FILE: upload.js
//
//         USAGE: ---
//   DESCRIPTION: This file provides functionality to allow the user to
//                - upload new files. The files are added to the swiftlatex
//                  engine and can be included in the document.
//                - import a project. All currently existing files are deleted.
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

/*
 * show the upload dialog
 */
function open_upload_form()
{
    close_forms();
    document.getElementById("uploadform").style.display = "block";
}

/*
 * show the import dialog
 */
function open_import_form()
{
    close_forms();
    document.getElementById("importform").style.display = "block";
}

/*
 * close all dialogs
 */
function close_forms()
{
    document.getElementById("fileupload").value = "";
    document.getElementById("uploadform").style.display = "none";

    document.getElementById("projectimport").value = "";
    document.getElementById("importform").style.display = "none";
}

/*
 * upload new files and add them to the project
 */
async function upload()
{
    await upload_files('fileupload');
    await new Promise(r => setTimeout(r, 500));
    close_forms();
}

/*
 * import a project
 */
async function import_project()
{
    // disable compile button during import:
    compile_button.disabled = true;

    // remove all files:
    engine.flushCache();
    config_project_files = [];
    config_placeholders = [];
    uploads = [];
    compile_first_time = true;

    // add new files:
    await upload_files('projectimport');
    await new Promise(r => setTimeout(r, 500));

    // set new main file:
    if(set_new_main_tex_file())
    {
        compile_button.disabled = false;
        message.style.display = "none";
    }
    else // no main file was found
    {
        console.log('no main tex file found');
        set_editor_text('');
        message.innerHTML = '<p style="color: red;">Keine TeX-Hauptdatei gefunden</p>';
        message.style.display = "block";
    }

    // update frontend:
    config_template_name = "Importiertes Projekt";
    templatename.innerHTML = config_template_name;
    pdfviewer.innerHTML = ''; // close pdf viewer
    tex_console.style.display = "none"; // close tex console
    close_forms();
}

/*
 * read one or more files from an html file input element
 * and add them to the current project
 */
async function upload_files(id)
{
    var files = document.getElementById(id).files;

    for(let i = 0; i < files.length; i++)
    {
        var file = files[i];
        var filename = file.name;

        await read_single_file(file, filename);
    }
}

/*
 * read a single file and add it to the current project
 */
async function read_single_file(file, filename)
{
    var reader = new FileReader();

    reader.onload = function(e) // reads a single file
    {
        // check if file was already uploaded:
        if(uploads.find(item => item['name'] == filename)
            || config_project_files.includes(filename))
        {
            console.log('file already exists: ' + filename);
            return;
        }

        // process file data:
        var data = new Uint8Array(e.target.result);

        if(/^.+\.(tex|bib|sty|cls)$/.test(filename)) // text based files
        {
            data = new TextDecoder().decode(data); // to string
            console.log('add: ' + filename + ' as text');
        }
        else // binary files
        {
            // no action needed
            console.log('add: ' + filename + ' as binary');
        }

        // add to latex engine:
        engine.writeMemFSFile(filename, data);

        // add to array of uploaded files:
        uploads.push({ name: filename, lastModified: new Date(), input: data });
    }

    await reader.readAsArrayBuffer(file);
}

/*
 * determine the new main tex file and add it to engine and editor
 */
function set_new_main_tex_file()
{
    // search for main tex file (includes '\documentclass'):
    for(const file of uploads)
    {
        if(file.input.includes('\\documentclass'))
        {
            config_main_tex_file = file.name;
            set_main_tex_file();
            set_editor_text(file.input);

            return true;
        }
    }

    return false;
}
