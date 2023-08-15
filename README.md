# Quell-Repository für LaTeX-Vorlagen

## Anlegen und Veröffentlichen einer neuen Vorlage

1. Im Verzeichnis `templates` einen neuen Ordner erzeugen. Der Name dieses Ordners dient später als Name der Vorlage.
1. Sämtliche LaTeX-Projektdateien in diesem Ordner ablegen.
1. Die Änderungen pushen. Anschließend erzeugt eine GitHub-Action für jede Vorlage eine Webanwendung im öffentlichen Repository, die über GitHub-Pages gehostet wird.

## Verwendung von Platzhaltern

Im LaTeX-Dokument können zwei Arten von Platzhaltern verwendet werden. Aus diesen Platzhaltern generiert die Webanwendung eine Eingabemaske. Platzhalter werden durch doppelte geschweifte Klammern markiert:

- Textfelder für einzeilige Eingaben: Z. B. `{{Titel}}` oder `{{Name des Autors}}`
- Textarea für mehrzeilige Eingaben. Dazu wird an den Platzhalter ein Leerzeichen angehängt: Z. B. `{{Nachricht }}` oder `{{Adresse des Empfängers }}`

Die Formularfelder unterstützen das Einfügen von LaTeX-Code.
