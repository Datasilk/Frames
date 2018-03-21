using System.IO;
using SixLabors.ImageSharp;

namespace Utility
{
    public struct ImageInfo
    {
        public string path;
        public string filename;
        public int width;
        public int height;
        public Image<Rgba32> bitmap;
    }
        

    public class Images
    {
        private Core S;

        public Images(Core CollectorCore)
        {
            S = CollectorCore;
        }

        
        public ImageInfo Load(string filepath)
        {
            var filename = S.Util.Str.GetFilename(filepath);
            var path = filepath.Replace(filename, "");
            var img = new ImageInfo();
            using (var fs = File.OpenRead(filepath))
            {
                var image = Image.Load(fs);
                img.bitmap = image;
                img.filename = filename;
                img.path = path;
                img.width = image.Width;
                img.height = image.Height;
            }
            return img;
        }
        
        public ImageInfo Shrink(ImageInfo image, int width)
        {
            image.bitmap.Mutate(x => {
                x.Resize(new SixLabors.ImageSharp.Processing.ResizeOptions()
                {
                    Size = new SixLabors.Primitives.Size(width, 0)
                });
            });
            return image;
        }

        public ImageInfo Shrink(ImageInfo image, int width, string outputfile)
        {
            image.bitmap.Mutate(x => {
                x.Resize(new SixLabors.ImageSharp.Processing.ResizeOptions()
                {
                    Size = new SixLabors.Primitives.Size(width, 0)
                });
            });
            Save(image, outputfile);
            return image;
        }


        public void Save(ImageInfo image, string outputfile)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                string ext = S.Util.Str.getFileExtension(outputfile);
                switch (ext)
                {
                    case "jpg":
                    case "jpeg":
                        image.bitmap.Save(ms, ImageFormats.Jpeg);
                        break;

                    case "png":
                        image.bitmap.Save(ms, ImageFormats.Png);
                        break;

                    case "gif":
                        image.bitmap.Save(ms, ImageFormats.Gif);
                        break;

                    case "bmp":
                        image.bitmap.Save(ms, ImageFormats.Bmp);
                        break;

                }
                //save to disk
                using (FileStream fs = new FileStream(outputfile, FileMode.Create))
                {
                    ms.Position = 0;
                    ms.WriteTo(fs);
                    fs.Dispose();
                }
                ms.Dispose();
            }
        }

        public void GenerateThumbnails(ImageInfo image, string outputfolder)
        {
            var filename = image.filename;
            var ext = S.Util.Str.getFileExtension(filename);
            var filepart = filename.Replace("." + ext, "");
            Shrink(image, 800, outputfolder + filepart + "-lg." + ext);
            Shrink(image, 400, outputfolder + filepart + "-med." + ext);
            Shrink(image, 200, outputfolder + filepart + "-sm." + ext);
        }
    }
}
