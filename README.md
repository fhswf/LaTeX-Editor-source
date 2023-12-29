# LaTeX-Editor *(source-Repository)*

Dieses Projekt stellt einen webbasierten LaTeX-Editor und verschiedene LaTeX-Vorlagen bereit.

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
