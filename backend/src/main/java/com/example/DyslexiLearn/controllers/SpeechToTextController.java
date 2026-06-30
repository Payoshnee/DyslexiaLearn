// package com.example.DyslexiLearn.controllers;

// import com.example.DyslexiLearn.services.SpeechToTextService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.File;
// import java.io.FileOutputStream;
// import java.io.IOException;

// @RestController
// @RequestMapping("/api/speech-to-text")
// public class SpeechToTextController {

//     @Autowired
//     private SpeechToTextService speechToTextService;

//     // Endpoint for converting speech to text
//     @PostMapping
//     public String convertSpeechToText(@RequestParam("file") MultipartFile file) throws IOException {
//         // Save the uploaded file to a temporary location
//         File tempFile = new File(System.getProperty("java.io.tmpdir"), file.getOriginalFilename());
//         try (FileOutputStream fos = new FileOutputStream(tempFile)) {
//             fos.write(file.getBytes());
//         }

//         // Call the service to convert the speech to text
//         return speechToTextService.convertSpeechToText(tempFile.getAbsolutePath());
//     }
// }



////////////////////////with out api//////////////////////////////////////////////////////

package com.example.DyslexiLearn.controllers;

import com.example.DyslexiLearn.services.SpeechToTextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Controller
@RequestMapping("/speech-to-text")
public class SpeechToTextController {

    @Autowired
    private SpeechToTextService speechToTextService;

    // Endpoint for rendering the form (if you want a simple HTML form)
    @GetMapping
    public String showUploadForm() {
        return "uploadForm"; // This should be your HTML form to upload the file
    }

    // Endpoint for handling file upload and converting speech to text
    @PostMapping
    public String handleFileUpload(@RequestParam("file") MultipartFile file, Model model) throws IOException {
        // Check if the file is empty
        if (file.isEmpty()) {
            model.addAttribute("message", "Please select a file to upload");
            return "uploadForm"; // return to the upload form
        }

        // Save the uploaded file to a temporary location
        File tempFile = new File(System.getProperty("java.io.tmpdir"), file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(file.getBytes());
        }

        // Convert speech to text using the service
        String transcript = speechToTextService.convertSpeechToText(tempFile.getAbsolutePath());

        // Add the transcript to the model to display it in the view
        model.addAttribute("transcript", transcript);
        return "result"; // Return a view to display the result (e.g., 'transcript' in the result page)
    }
}
