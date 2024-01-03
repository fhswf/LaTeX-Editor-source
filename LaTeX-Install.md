# Installing LaTeX

Instructions for installing LaTeX locally on the PC.

The TeX distribution *TeX Live* is required to compile a document. For editing documents, the editor *TeXstudio* is a good choice.

**Windows**

There are installers for Windows:

- TeX Live: [www.tug.org/texlive](https://www.tug.org/texlive/)
- TeXstudio: [www.texstudio.org](https://www.texstudio.org/)

After installing TeXstudio, *Biber* must be configured as the bibliography backend:  
*Options* > *Configure TeXstudio* > *Build* > *Default Bibliography Tool: Biber*

**macOS**

On the Mac, TeX Live is distributed as *MacTeX*: [www.tug.org/mactex](https://www.tug.org/mactex/)

The editor *TeXShop* is included in MacTeX. TeXstudio ([www.texstudio.org](https://www.texstudio.org/)) can be installed additionally if desired.

**Ubuntu**

Installing TeX Live using the package manager in the command line:

    sudo apt-get install texlive texlive-lang-german texlive-latex-extra biber

Installing the editor TeXstudio:

    sudo apt-get install texstudio

As described above, Biber must then be configured.
