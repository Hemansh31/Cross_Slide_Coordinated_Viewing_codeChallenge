import pyvips

img_directory = 'test_images/'
img_files = ['original.jpeg', 'cropped.jpeg', 'croppedAndRotated.jpeg', 'rotate.jpeg']

output_directory = 'test_dzi/'

for files in img_files:
    img = pyvips.Image.new_from_file(img_directory + files, access='sequential')
    img.dzsave(output_directory + files[0 : -5])
