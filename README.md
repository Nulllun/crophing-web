# Crophing -- A simple all-in-one clothing showcase platform
Crophing is a simple website that you can upload and edit different designs that you have in your mind while your customers have the freedom to customize the size of the garment.  
The most recent commit hash value of master branch is d8bc64896087cee446fd926ae4556b04d1284fab    
Demo video: https://youtu.be/eDs48APii5g
# Getting Started

## Prerequisites
Chrome 74.0+

## Installing
You can download the entire project and deploy on your machine or on a remote server. To download the project, you can download the zip file or run the following command
```
git clone https://github.com/Nulllun/CSCI4140_project.git
```

## Usage
### Upload garment designs
When you first open the index page, you can choose to upload and edit your designs. After you upload the file, you can crop it by selecting the required regions in the image.  
For clothes, you need to crop both arms and body.  
For trousers/dress, you only need to crop it.  
If you have cropped the wrong region from the image, you can re-crop the parts and it will be replaced by the newest edit.  
After you have finished, click the finish button and your design will now be displayed on the assemble page.
### Assemble created designs
In the assemble page, you can find different designs appear in the head bar. 
When you choose a piece of garment, you can 'try on' the clothing by draging the pieces together. 
* You can enlarge and rotate the pieces to fit your own size and posture. 
* If you click a single piece, it will be moved to the top layer. 
* If you double click it, it will be removed.
#### For more details, please refers to the demo video [here](https://youtu.be/eDs48APii5g)

## Acknowledgement
* [netplayer crop](https://github.com/netplayer/crop)
* [trim-canvas](https://gist.github.com/remy/784508)
