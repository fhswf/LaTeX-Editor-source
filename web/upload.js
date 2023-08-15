// =============================================================================
//
//          FILE: upload.js
//
//         USAGE: ---
//   DESCRIPTION: This file provides functionality to allow the user to upload
//                new files. The files are added to the swiftlatex engine and
//                and can be referenced in the latex file.
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

/*
 * show the upload dialog
 */
function open_upload_form()
{
    document.getElementById("uploadform").style.display = "block";
}

/*
 * close the upload dialog
 */
function close_upload_form()
{
    document.getElementById("fileupload").value = "";
    document.getElementById("uploadform").style.display = "none";
}

/*
 * add uploaded file to the project
 */
async function upload()
{
    var file = document.getElementById('fileupload');
    filename = file.value.split('\\').pop(); // strip path

    // check if file was uploaded already:
    if(uploads.find( item => item['name'] === filename ))
    {
        close_upload_form();
        console.log('file already exists');
        return;
    }

    // add file to project:
    if(file.files.length) // upload successful
    {
        var reader = new FileReader();

        if(/^.+\.(tex|bib|sty|cls)$/.test(filename)) // text based files
        {
            console.log('upload: ' + filename + ' as text');

            reader.onload = function(e)
            {
                // add to latex engine:
                engine.writeMemFSFile(filename, e.target.result);
                // add to array of uploaded files:
                uploads.push({ name: filename, lastModified: new Date(), input: e.target.result });
            };

            reader.readAsBinaryString(file.files[0]);
        }
        else // binary files
        {
            console.log('upload: ' + filename + ' as binary');

            reader.onload = function(e)
            {
                // add to latex engine:
                engine.writeMemFSFile(filename, new Uint8Array(e.target.result));
                // add to array of uploaded files:
                uploads.push({ name: filename, lastModified: new Date(), input: new Uint8Array(e.target.result) });
            };

            reader.readAsArrayBuffer(file.files[0]);
        }
    }

    close_upload_form();
}
