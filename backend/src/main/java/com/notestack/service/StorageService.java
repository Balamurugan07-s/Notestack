package com.notestack.service;

import com.notestack.exception.StorageException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class StorageService {

    private final Path rootLocation;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "pdf", "docx", "pptx", "png", "jpg", "jpeg", "webp"
    );

    public StorageService(@Value("${notestack.storage.location:uploads}") String location) {
        this.rootLocation = Paths.get(location);
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new StorageException("Could not initialize storage location", e);
        }
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new StorageException("Failed to store empty file");
        }

        String originalFilename = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "document"
        );

        if (originalFilename.contains("..")) {
            throw new StorageException("Cannot store file with relative path outside current directory " + originalFilename);
        }

        String extension = "";
        int dotIdx = originalFilename.lastIndexOf('.');
        if (dotIdx > 0) {
            extension = originalFilename.substring(dotIdx + 1).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new StorageException("File type not allowed. Allowed types: PDF, DOCX, PPTX, PNG, JPG, JPEG, WEBP");
        }

        String uniqueFilename = UUID.randomUUID().toString() + "_" + originalFilename;

        try {
            Path destinationFile = this.rootLocation.resolve(uniqueFilename).normalize().toAbsolutePath();
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }
            return uniqueFilename;
        } catch (IOException e) {
            throw new StorageException("Failed to store file " + originalFilename, e);
        }
    }

    public Resource loadAsResource(String filename) {
        try {
            Path file = rootLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new StorageException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new StorageException("Could not read file: " + filename, e);
        }
    }

    public void delete(String filename) {
        try {
            Path file = rootLocation.resolve(filename).normalize();
            Files.deleteIfExists(file);
        } catch (IOException e) {
            // Log but don't break
        }
    }
}
