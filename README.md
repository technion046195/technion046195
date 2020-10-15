<p align="center">
  <a href="https://technion046195.netlify.app/">
    <img alt="Logo" src="content/assets/technion046195_logo.png" width="100" />
  </a>
</p>
<h1 align="center">
  Course 046196 - Introduction to Machine Learning
</h1>

The website can be found at <https://technion046195.netlify.app/>

This repository contains:

- The site's content.
- The Jupyter notebooks which are uses to to create some of the courses content.  
- The Jupyter notebooks assignments.

## Some technical details

The course's website is powered by the [Gatsby platform](http://gatsbyjs.com/), and is served using [netlify](https://www.netlify.com/). In addition the site and the Jupyter server can be ran locally using a [docker](https://www.docker.com/) container. The details about running the site locally can be found bellow.

The content of the web site (lectures, tutorials, additional data) is written in [markdown](https://en.wikipedia.org/wiki/Markdown) and is concentrated in the content folder.

The deployment status of the site can be found here: <a href="https://app.netlify.com/sites/technion046195/deploys"><img src="https://api.netlify.com/api/v1/badges/98ffd985-f712-420b-9c05-2fd440fd134f/deploy-status"  target="_blank"/></a>

The diagrams in this course are generated using [draw.io](https://app.diagrams.net/). The file containing all the diagrams can be found in *content/assets/diagrams.drawio*

## Contributing

The suggested way for editing the contant of the website is by running the site localy which is updated on the fly as the markdown content is being updated.

### Install docker

In order to run the site locally docker must be installed. On Ubuntu 18.04 (or newer) this can be done using the following commands:

``` bash
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker
```

The installation details for other OSs can be found on the offical website:

- **Windows**: <https://docs.docker.com/docker-for-windows/install/>
- **Mac**: <https://docs.docker.com/docker-for-mac/install/>
- **Other linux distributions**: <https://docs.docker.com/engine/install/>

### Running locally

To run the website and the Jupyter server move to the folder containing this repository and run the following command:

``` bash
sudo docker run -it --rm -v "$PWD:/project/app" --net=host omeryair/technion046195:v0.1
```

The website should then be avilable at <http://localhost:8000>. The jupyter service should be avilable at <http://localhost:7000/tree/content>.

At this point changes which are made to the markdown file in the content folder should immediately appear on the site each save of the file. The markdown files can be edit using any arbitrary text editor or be dedicated editors (see resources section).

## Editing markdown files

### [Typora](https://typora.io/)

Typora is a dedicated editor for markdown files an formats the markdown text as you type it (including equations). Typora does not support viewing right-to-left(RTL) documents out of the box, but this can be fixed by adding an custom RTL theme.

### Adding support for inline equatiopins

Support for inlien equations should be added in *File->Presences->Markdown->Syntax Support->Inline Math

### Adding RTL theme

On such RTL theme can be found at <https://github.com/peleg68/github-rtl>. To add it to Typora you need to download the *github-rtl.css* file and the *github-rtl* folder to Typora's theme's folder. The theme folder can be found by goint to *File->Preference->Appearance->OpenTheme Folder*.

After adding the theme it can be selected from the Themes menu.

### [VSCode](https://code.visualstudio.com/)

VSCode in a great open-source code editor maintained by Microsoft. It offers live markdown preview out of the box but without support for equations. Equation support can be added by installing an plugin such as [Markdown+Math](https://marketplace.visualstudio.com/items?itemName=goessner.mdmath)

### Committing notebooks

In order to remove some unnecessary temporary data from the Jupyter notebooks (which clutters the commits) use the following method to add an automatic clean up command to the git add process (this will only have effect in this repository). This need to be done once:

1. Install jq

  ``` bash
  sudo apt install jq
  ```

2. run the following command in the repository folder:

  ```bash
  git config --local include.path ../.gitconfig
  ```

## Resources

Free images:

- [Unsplash](https://unsplash.com/)
- [Pixabay](https://pixabay.com/)
- [Pexels](https://www.pexels.com/)

Free vector graphics:

- [freepik](https://www.freepik.com/)
- [Vecteezy](https://www.vecteezy.com/)
- [Free Vector](https://www.freevector.com/)
