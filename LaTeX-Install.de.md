# Installation von LaTeX

Anleitung für die lokale Installation von LaTeX auf dem PC.

Zum Kompilieren eines Dokuments wird die TeX-Distribution *TeX Live* benötigt. Als Editor für das Bearbeiten von Dokumenten ist *TeXstudio* zu empfehlen.

**Windows**

Für Windows gibt es Installer:

- TeX Live: [www.tug.org/texlive](https://www.tug.org/texlive/)
- TeXstudio: [www.texstudio.org](https://www.texstudio.org/)

Nach der Installation von TeXstudio muss *Biber* als Bibliographieprogramm ausgewählt werden:  
*Optionen* > *TeXstudio konfigurieren* > *Erzeugen* > *Standard Bibliographieprogramm: Biber*

**macOS**

Auf dem Mac wird TeX Live unter dem Namen *MacTeX* angeboten: [www.tug.org/mactex](https://www.tug.org/mactex/)

Die Entwicklungsumgebung *TeXShop* ist bereits in MacTeX enthalten. Auf Wunsch kann TeXstudio ([www.texstudio.org](https://www.texstudio.org/)) nachinstalliert werden.

**Ubuntu**

Installation von TeX Live über die Paketverwaltung in der Shell:

    sudo apt-get install texlive texlive-lang-german texlive-latex-extra biber

Installation des Editors TeXstudio:

    sudo apt-get install texstudio

Wie oben beschrieben muss anschließend Biber konfiguriert werden.
