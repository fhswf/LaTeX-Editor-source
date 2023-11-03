// =============================================================================
//
//          FILE: download.js
//
//         USAGE: ---
//   DESCRIPTION: This file contains functionality to allow the user to download
//                the latex project files. It uses the client-zip library:
//                https://github.com/Touffy/client-zip
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

import { downloadZip } from "https://cdn.jsdelivr.net/npm/client-zip/index.js"

/*
 * zip project files and open a download dialog
 */
async function download()
{
    close_forms();

    let download_files = [];

    // add project files to array:
    for(const file of config_project_files)
    {
        let file_add;

        if(file === config_main_tex_file)
        {
            // copy main tex file text from editor:
            file_add = { name: file, lastModified: new Date(), input: editor.getValue() };
        }
        else
        {
            file_add = await fetch(file);
        }

        download_files.push(file_add);
    }

    // add files uploaded by the user:
    for(let file of uploads)
    {
        if(file.name === config_main_tex_file)
        {
            // copy main tex file text from editor:
            file = { name: file.name, lastModified: new Date(), input: editor.getValue() };
        }

        download_files.push(file);
    }

    // zip files:
    const zip = await downloadZip(download_files).blob();

    // make and click a temporary link to download the archive:
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zip);
    link.download = config_template_name + '.zip';
    link.click();
    link.remove();
}

window.download = download; // make module function available
