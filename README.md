# LaTeX-Editor

This project provides a web-based LaTeX editor and various LaTeX templates. The editor supports client-side compilation of documents in the browser using WebAssembly.

The web application is hosted in a separate repository: [github.com/fhswf/LaTeX-Editor](https://github.com/fhswf/LaTeX-Editor)

## Adding a new template

1. Create a new folder with the LaTeX project files in the `templates` directory. The name of the folder will later serve as the name of the template in the web application.
1. Commit and push changes. A GitHub workflow then automatically transfers the templates to the target repository.

The web application is deployed in the same way. Accordingly, changes or bug fixes are performed here in this repository.

## Using placeholders

Placeholders can be used in the LaTeX document, from which the web application then generates a form. Placeholders are enclosed in double braces:

- e.g. `{{Title}}` or `{{Authors name}}` for simple text fields
- e.g. `{{Abstract }}` for multi-line text fields by appending a space character

The form input fields accept LaTeX code.

LaTeX line breaks can be used in the placeholders, for example `{{Regards\\Bob}}`. In multi-line text fields, the placeholder text is then actually broken into lines, while the backslashes are retained.

## About

This project uses [SwiftLaTeX](https://github.com/SwiftLaTeX/SwiftLaTeX/) and WebAssembly for client-side compilation of LaTeX documents in the web browser. Furthermore, [Texlive-Ondemand](https://github.com/SwiftLaTeX/Texlive-Ondemand), [Ace](https://ace.c9.io/) and [client-zip](https://github.com/Touffy/client-zip) are used.

## Setup

The project is based on two repositories:

- **Source repository (this repository):** LaTeX templates, source code of the web application, workflow for deployment
- **Target repository:** This is where the web application is hosted using GitHub pages.

An RSA key pair is required for deployment.

### Target repository

- set up GitHub pages and select the `/docs` directory as the document root
- add the public key as *deploy key* and enable the option *allow write access* (see `.github/workflows/deploy.yml`)
- (optional: set up a custom domain; to do this, the following CNAME entry must be configured with the internet service provider: `<gituser>.github.io.`)

### Source repository

- add the private key as an *actions secret* with the name `ID_RSA` (see `.github/workflows/deploy.yml`)
- enter the target repository in `.github/workflows/deploy.yml` under `REMOTE_REPO`
- change the URL of the TeXLive on-demand server in `swiftlatex/texliveserver.js` if a different server is to be used
- (if a custom domain is used, this is entered in `.github/workflows/deploy.yml` under `REMOTE_CUSTOM_URL`; this automatically creates a corresponding `CNAME` file)

### TeXLive on-demand server

If you do not want to use the server provided by [SwiftLaTeX](https://github.com/SwiftLaTeX/SwiftLaTeX), you can set up your own server using a Docker container:

```
git clone https://github.com/SwiftLaTeX/Texlive-Ondemand
cd Texlive-Ondemand/
sudo docker build --tag texondemand .
sudo docker run --restart unless-stopped --detach -p 4711:5001 texondemand
```

The URL (e.g. `http://latex.example.net:4711/`) is then added to `swiftlatex/texliveserver.js` as described above.
