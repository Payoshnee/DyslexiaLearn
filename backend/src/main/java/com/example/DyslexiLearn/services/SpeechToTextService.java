// package com.example.DyslexiLearn.services;

// import com.google.cloud.speech.v1.*;
// import com.google.protobuf.ByteString;
// import org.springframework.stereotype.Service;

// import java.io.FileInputStream;
// import java.io.IOException;

// @Service
// public class SpeechToTextService {

//     public String convertSpeechToText(String audioFilePath) throws IOException {
//         // Detect file format based on extension
//         String fileFormat = getFileExtension(audioFilePath);

//         RecognitionConfig.AudioEncoding encoding = getAudioEncoding(fileFormat);

//         // Check if the encoding is supported
//         if (encoding == null) {
//             throw new IllegalArgumentException("Unsupported file format: " + fileFormat);
//         }

//         try (SpeechClient speechClient = SpeechClient.create()) {
//             // Read the audio file into bytes
//             ByteString audioBytes = ByteString.readFrom(new FileInputStream(audioFilePath));

//             // Configure the recognition settings
//             RecognitionConfig recognitionConfig = RecognitionConfig.newBuilder()
//                     .setEncoding(encoding)
//                     .setSampleRateHertz(16000)  // Default sample rate (adjust based on file)
//                     .setLanguageCode("en-US")
//                     .build();

//             // Build the recognition audio
//             RecognitionAudio recognitionAudio = RecognitionAudio.newBuilder()
//                     .setContent(audioBytes)
//                     .build();

//             // Perform speech recognition
//             RecognizeResponse response = speechClient.recognize(recognitionConfig, recognitionAudio);

//             // Extract the transcribed text
//             if (response.getResultsList().isEmpty()) {
//                 return "No speech detected.";
//             }

//             SpeechRecognitionAlternative alternative = response.getResultsList()
//                     .get(0)
//                     .getAlternativesList()
//                     .get(0);

//             return alternative.getTranscript();
//         }
//     }

//     // Helper to determine file extension
//     private String getFileExtension(String fileName) {
//         int lastIndex = fileName.lastIndexOf('.');
//         return lastIndex > 0 ? fileName.substring(lastIndex + 1).toLowerCase() : "";
//     }

//     // Helper to map file extension to encoding
//     private RecognitionConfig.AudioEncoding getAudioEncoding(String fileFormat) {
//         switch (fileFormat) {
//             case "wav":
//                 return RecognitionConfig.AudioEncoding.LINEAR16;
//             case "flac":
//                 return RecognitionConfig.AudioEncoding.FLAC;
//             case "ogg":
//                 return RecognitionConfig.AudioEncoding.OGG_OPUS;
//             case "amr":
//                 return RecognitionConfig.AudioEncoding.AMR;
//             case "awb":
//                 return RecognitionConfig.AudioEncoding.AMR_WB;
//             default:
//                 return null; // Unsupported format
//         }
//     }
// }
/////////////////////////////////////without api/////////////////////////////////////

package com.example.DyslexiLearn.services;

import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;

@Service
public class SpeechToTextService {

    public String convertSpeechToText(String audioFilePath) throws IOException {
        // Detect file format based on extension
        String fileFormat = getFileExtension(audioFilePath);
        RecognitionConfig.AudioEncoding encoding = getAudioEncoding(fileFormat);

        // Check if the encoding is supported
        if (encoding == null) {
            throw new IllegalArgumentException("Unsupported file format: " + fileFormat);
        }

        try (SpeechClient speechClient = SpeechClient.create()) {
            // Read the audio file into bytes
            ByteString audioBytes = ByteString.readFrom(new FileInputStream(audioFilePath));

            // Configure the recognition settings
            RecognitionConfig recognitionConfig = RecognitionConfig.newBuilder()
                    .setEncoding(encoding)
                    .setSampleRateHertz(16000)  // Default sample rate (adjust based on file)
                    .setLanguageCode("en-US")
                    .build();

            // Build the recognition audio
            RecognitionAudio recognitionAudio = RecognitionAudio.newBuilder()
                    .setContent(audioBytes)
                    .build();

            // Perform speech recognition
            RecognizeResponse response = speechClient.recognize(recognitionConfig, recognitionAudio);

            // Extract the transcribed text
            if (response.getResultsList().isEmpty()) {
                return "No speech detected.";
            }

            SpeechRecognitionAlternative alternative = response.getResultsList()
                    .get(0)
                    .getAlternativesList()
                    .get(0);

            return alternative.getTranscript();
        }
    }

    // Helper to determine file extension
    private String getFileExtension(String fileName) {
        int lastIndex = fileName.lastIndexOf('.');
        return lastIndex > 0 ? fileName.substring(lastIndex + 1).toLowerCase() : "";
    }

    // Helper to map file extension to encoding
    private RecognitionConfig.AudioEncoding getAudioEncoding(String fileFormat) {
        switch (fileFormat) {
            case "wav":
                return RecognitionConfig.AudioEncoding.LINEAR16;
            case "flac":
                return RecognitionConfig.AudioEncoding.FLAC;
            case "ogg":
                return RecognitionConfig.AudioEncoding.OGG_OPUS;
            case "amr":
                return RecognitionConfig.AudioEncoding.AMR;
            case "awb":
                return RecognitionConfig.AudioEncoding.AMR_WB;
            default:
                return null; // Unsupported format
        }
    }
}
