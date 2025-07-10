package com.example.vecinity.config;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;

@Configuration
public class FirebaseConfig {
    @PostConstruct
    public void init() throws Exception {
        //ruta donde se guarda el archivo de credenciales de Firebase
        FileInputStream serviceAccount = new FileInputStream("C:\\Users\\daniv\\Desktop\\Vecinity\\vecinity-backend\\src\\main\\java\\com\\example\\vecinity\\config\\vecinity-65494-firebase-adminsdk-fbsvc-91cbebf9b0.json");
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
    }
}