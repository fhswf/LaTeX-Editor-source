# Quell-Repository für LaTeX-Vorlagen

## Anlegen und Veröffentlichen einer neuen Vorlage

1. Im Verzeichnis `templates` einen neuen Ordner anlegen. Der Name dieses Ordners dient später als Name der Vorlage.
2. Sämtliche LaTeX-Projektdateien in diesem Ordner ablegen.
3. Die Änderungen übernehmen und pushen. Anschließend erzeugt ein GitHub-Workflow für jede Vorlage eine Webanwendung im öffentlichen Repository, die über GitHub-Pages gehostet wird.

## Verwendung von Platzhaltern

Im LaTeX-Dokument können zwei Arten von Platzhaltern verwendet werden. Aus diesen Platzhaltern generiert die Webanwendung eine Eingabemaske. Die Formularfelder unterstützen das Einfügen von LaTeX-Code. Platzhalter werden in doppelte geschweifte Klammern gefasst:

- Textfelder für einzeilige Eingaben: bspw. `{{Titel}}` oder `{{Name des Autors}}`
- Textfelder für mehrzeilige Eingaben. Dazu wird an den Platzhalter ein Leerzeichen angehängt: bspw. `{{Nachricht }}` oder `{{Adresse des Empfängers }}`

In Platzhaltern können LaTeX-Zeilenumbrüche (`\\`) verwendet werden, zum Beispiel `{{MfG\\Bob}}`. In mehrzeiligen Eingabefeldern werden diese um tatsächliche Zeilenumbrüche ergänzt, wobei die Rückstriche erhalten bleiben.

## SwiftLaTeX

Dieses Projekt nutzt *SwiftLaTeX*: [https://github.com/SwiftLaTeX/SwiftLaTeX/](https://github.com/SwiftLaTeX/SwiftLaTeX/)
