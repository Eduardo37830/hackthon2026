package edu.ucaldas.hackathon.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.ucaldas.hackathon.DTOs.camera.CreateCameraDTO;
import edu.ucaldas.hackathon.DTOs.camera.GetCameraDTO;
import edu.ucaldas.hackathon.DTOs.camera.MonitoringSocketStatusDTO;
import edu.ucaldas.hackathon.DTOs.camera.UpdateCameraDTO;
import edu.ucaldas.hackathon.services.CameraMonitoringSubscriptionTracker;
import edu.ucaldas.hackathon.services.CameraService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import jakarta.validation.Valid;



@RestController
@RequestMapping("/camera")
public class CameraController {
    @Autowired
    private CameraService cameraService;

    @Autowired
    private CameraMonitoringSubscriptionTracker subscriptionTracker;

    @GetMapping("/{id}")
    public ResponseEntity<GetCameraDTO> getCamera(@PathVariable String id) {
        var camera = cameraService.getCameraById(id);
        return ResponseEntity.ok(camera);
    }

    @GetMapping("")
    public ResponseEntity<Page<GetCameraDTO>> getAllCameras(@PageableDefault(size = 20) Pageable pageable) {
        var cameras = cameraService.getAllCameras(pageable);
        return ResponseEntity.ok(cameras);
    }

    @GetMapping("/monitoring/status")
    public ResponseEntity<MonitoringSocketStatusDTO> getMonitoringSocketStatus() {
        var response = new MonitoringSocketStatusDTO(
                subscriptionTracker.hasActiveSubscribers(),
                subscriptionTracker.getActiveSubscriptionsCount());
        return ResponseEntity.ok(response);
    }


    @PostMapping("")
    public ResponseEntity<GetCameraDTO> createCamera(@Valid @RequestBody CreateCameraDTO createCameraDTO) {
        var camera = cameraService.createCamera(createCameraDTO);
        return ResponseEntity.created(URI.create("/camera/" + camera.id())).body(camera);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GetCameraDTO> updateCamera(@PathVariable String id, @Valid @RequestBody UpdateCameraDTO updateCameraDTO) {
        var camera = cameraService.updateCamera(id, updateCameraDTO);
        return ResponseEntity.ok(camera);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCamera(@PathVariable String id) {
        cameraService.deleteCamera(id);
        return ResponseEntity.noContent().build();
    }

}
