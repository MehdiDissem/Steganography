let img = new Image();
      img.crossOrigin = "Anonymous";
      img.src =
        "https://res.cloudinary.com/dlnvacfsc/image/upload/v1684228712/DataPatrol/use-cases_qyg2gz.jpg";
      img.onload = function () {
        let canvas = document.getElementById("myCanvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Function to hide text in the image
        function hideText() {
          let text = document.getElementById("inputText").value;
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          console.log(imgData)
          let data = imgData.data;
          let textBinary = textToBinary(text);
          let changedPixels = [];

          // Termination marker to the binary representation of the hidden text
          textBinary += "00000000";

          console.log("before ", data, textBinary);

          // Iterate over each bit of the binary text
          for (let i = 0; i < textBinary.length; i++) {
            let bit = parseInt(textBinary.charAt(i));
            let position = i * 4 + 2; // Modify the blue channel for each pixel
            let color = data[position];

            // Make the color value even or odd based on the current bit
            if (bit === 0 && color % 2 !== 0) {
              color--;
              changedPixels.push({
                index: position / 4,
                oldValue: color + 1,
                newValue: color,
              });
            } else if (bit === 1 && color % 2 === 0) {
              color++;
              changedPixels.push({
                index: position / 4,
                oldValue: color - 1,
                newValue: color,
              });
            }

            data[position] = color;
          }

          ctx.putImageData(imgData, 0, 0);
          console.log("Text hidden successfully!");
          console.log("After ", data, textBinary);
          console.log("Changed Pixels:", changedPixels);
        }

        // Function to extract hidden text from the image
        function extractText() {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          let data = imgData.data;
          let textBinary = "";
          let terminationMarker = "00000000";

          // Extract the least significant bit from the blue channel of each pixel
          for (let i = 0; i < data.length; i += 4) {
            let color = data[i + 2]; // Blue channel value
            let bit = color % 2; // Extract the LSB
            // Append the extracted bit to the binary string
            textBinary += bit;

            // Check if the termination marker is found
            if (textBinary.endsWith(terminationMarker)) {
              // Remove the termination marker from the textBinary string
              textBinary = textBinary.slice(0, -terminationMarker.length);
              break;
            }
          }

          let text = binaryToText(textBinary);
          console.log("Hidden Text:", text);

          const textarea = document.getElementById('hiddenText');
          textarea.append(text)
        }

        // Helper function to convert text to binary representation
        function textToBinary(text) {
          let binary = "";
          for (let i = 0; i < text.length; i++) {
            let charCode = text.charCodeAt(i);
            binary += charCode.toString(2).padStart(8, "0");
          }
          return binary;
        }

        // Helper function to convert binary representation to text
        function binaryToText(binary) {
          let text = "";
          for (let i = 0; i < binary.length; i += 8) {
            let byte = binary.substr(i, 8);
            let charCode = parseInt(byte, 2);
            text += String.fromCharCode(charCode);
          }
          return text;
        }

        // Attach event listener to the "Hide Text" button
        let hideButton = document.getElementById("hideButton");
        hideButton.addEventListener("click", hideText);

        // Attach event listener to the "Extract Hidden Text" button
        let extractButton = document.getElementById("extractButton");
        extractButton.addEventListener("click", extractText);

        // Attach event listener to the "Download Image" button
        let downloadButton = document.getElementById("downloadButton");
        downloadButton.addEventListener("click", function () {
          let downloadLink = document.createElement("a");
          downloadLink.href = canvas.toDataURL("image/png");
          downloadLink.download = "image_with_hidden_text.png";
          downloadLink.click();
        });

        // Attach event listener to the "Upload Image" input
        let uploadImage = document.getElementById("uploadImage");
        uploadImage.addEventListener("change", function (event) {
          let uploadedImage = event.target.files[0];
          let reader = new FileReader();

          reader.onload = function () {
            let uploadedImg = new Image();
            uploadedImg.src = reader.result;

            uploadedImg.onload = function () {
              canvas.width = uploadedImg.width;
              canvas.height = uploadedImg.height;
              ctx.drawImage(
                uploadedImg,
                0,
                0,
                uploadedImg.width,
                uploadedImg.height
              );

              extractText();
            };
          };

          reader.readAsDataURL(uploadedImage);
        });
      };


    //   function hideText() {
    //     let textBinary = "0110010101";
      
    //     for (let i = 0; i < textBinary.length; i++) {
    //       let bit = parseInt(textBinary.charAt(i));
    //       let position = i * 4 + 2;
      
    //       console.log(position)
    //     }
    //   }
    //   undefined
    //   function hideText() {
    //     let textBinary = "0110010101"; 
      
    //     for (let i = 0; i < textBinary.length; i++) {
    //       let bit = parseInt(textBinary.charAt(i));
    //       let position = i * 4 + 2;
    //         let check = position/4
      
    //       console.log(check)
    //     }
    //   }