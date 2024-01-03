# LaTeX-Editor

Dieses Projekt stellt einen webbasierten LaTeX-Editor und verschiedene LaTeX-Vorlagen bereit. Der Editor ermöglicht mittels WebAssembly das clientseitige Kompilieren von Dokumenten im Browser.

Die Webanwendung wird in einem separaten Repository gehostet: [github.com/fhswf/LaTeX-Editor](https://github.com/fhswf/LaTeX-Editor)

## Anlegen einer neuen Vorlage

1. Einen neuen Ordner mit den LaTeX-Projektdateien im Verzeichnis `templates` anlegen. Der Name des Ordners dient später in der Webanwendung als Name der Vorlage.
1. Änderungen übernehmen und pushen. Ein GitHub-Workflow überführt die Vorlagen dann automatisch in das Ziel-Repository.

Auf dieselbe Weise findet auch das Deployment der Webanwendung statt. Änderungen oder Bugfixes werden entsprechend hier in diesem Repository durchgeführt.

## Verwendung von Platzhaltern

Im LaTeX-Dokument können Platzhalter verwendet werden, aus welchen die Webanwendung ein Formular erzeugt. Platzhalter werden in doppelte geschweifte Klammern gefasst:

- bspw. `{{Titel}}` oder `{{Name des Autors}}` für einfache Textfelder
- bspw. `{{Abstract }}` für mehrzeilige Textfelder durch Anhängen eines Leerzeichens

Die Formularfelder unterstützen das Einfügen von LaTeX-Code.

In den Platzhaltern können LaTeX-Zeilenumbrüche verwendet werden, zum Beispiel `{{MfG\\Bob}}`. In mehrzeiligen Eingabefeldern werden diese um tatsächliche Zeilenumbrüche ergänzt, wobei die Rückstriche erhalten bleiben.

## About

Dieses Projekt nutzt [SwiftLaTeX](https://github.com/SwiftLaTeX/SwiftLaTeX/) und WebAssembly für das clientseitige Kompilieren von LaTeX-Dokumenten im Webbrowser. Des Weiteren kommen [Texlive-Ondemand](https://github.com/SwiftLaTeX/Texlive-Ondemand), [Ace](https://ace.c9.io/) und [client-zip](https://github.com/Touffy/client-zip) zum Einsatz.

## Setup

Das Projekt beruht auf zwei Repositorys:

- **Quell-Repository (dieses Repository):** LaTeX-Vorlagen, Quellcode der Webanwendung, Workflow für das Deployment
- **Ziel-Repository:** Hier wird die Webanwendung mittels GitHub-Pages gehostet.

Für das Deployment wird ein RSA-Schlüsselpaar benötigt.

### Ziel-Repository

- GitHub-Pages einrichten und das Verzeichnis `/docs` als Document-Root wählen
- den Public-Key als *deploy key* hinzufügen und die Option *allow write access* aktivieren (siehe `.github/workflows/deploy.yml`)
- (optional: Custom-Domain einrichten; dazu muss beim Internet Service Provider folgender CNAME-Eintrag vorgenommen werden: `<gituser>.github.io.`)

### Quell-Repository

- den Private-Key als *actions secret* mit dem Namen `ID_RSA` hinzufügen (siehe `.github/workflows/deploy.yml`)
- in `.github/workflows/deploy.yml` das Ziel-Repository unter `REMOTE_REPO` eintragen
- in `swiftlatex/texliveserver.js` die URL des TeXLive-On-Demand-Servers ändern, sofern ein abweichender Server verwendet werden soll
- (bei Verwendung einer Custom-Domain wird diese in `.github/workflows/deploy.yml` unter `REMOTE_CUSTOM_URL` eingetragen; dadurch wird automatisch eine entsprechende `CNAME`-Datei erzeugt)

### TeXLive-On-Demand-Server

Falls nicht der von [SwiftLaTeX](https://github.com/SwiftLaTeX/SwiftLaTeX) bereitgestellte Server verwendet werden soll, kann ein eigener Server mithilfe eines Docker-Containers betrieben werden:

```
git clone https://github.com/SwiftLaTeX/Texlive-Ondemand
cd Texlive-Ondemand/
sudo docker build --tag texondemand .
sudo docker run --restart unless-stopped --detach -p 4711:5001 texondemand
```

Die URL (bspw. `http://latex.example.net:4711/`) wird dann wie oben geschildert in `swiftlatex/texliveserver.js` eingetragen.
