# Cross_Slide_Coordinated_Viewing_codeChallenge
This Repository is my submission of the code challenge for the GSoC 2021 proposed project Cross-Slide Coordinated Viewing by caMicroscope

[Demo Video](https://drive.google.com/file/d/14Wqk1vx--jo7K5a1uv56YkRrogS2u5kP/view?usp=sharing)

# Instructions for running the code
1. Clone this repository
2. Open the **home.html** file in the browser.

# Explanation of my Implementation of the code challenge
1. The *home.html* opens a page which diplays options to choose any 2 images for Coordinated Viewing
   a. The 4 image options are a variant of the same base image
   b. One of the image is the original, one is rotated, one is cropped and the last one is both rotated and cropped.  
2. After selecting 2 images and clicking on View Slides *viewer.html* opens with the two images selected displayed side by side
3. The *Independent* option enables the 2 images to zoom, pan or rotate independently of each other
4. The *Synchronized* option enables the 2 images to zoom, pan or rotate synchronously i.e if one of the image is zoomed, panned or rotated the other image zooms,      pans or rotates automatically.

| **Original Image** | **Rotated Image** |**Cropped Image**|**Cropped and Rotated Image**|
|-----------|----------|--------|------------|
|<img src="test_images/original.jpeg" alt="Original Image" width="200"/>|<img src="test_images/rotate.jpeg" alt="Original Image" height="200"/>|<img src="test_images/cropped.jpeg" alt="Original Image" width="180"/>|<img src="test_images/croppedAndRotated.jpeg" alt="Original Image" width="180"/>|
