package com.evmanager.events.service;

import com.evmanager.events.dto.EventRequest;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.venues.model.Venue;
import com.evmanager.venues.repository.VenueRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.dao.DataIntegrityViolationException;
import com.evmanager.exception.ResourceConflictException;

import java.time.OffsetDateTime;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class EventConcurrencyIntegrationTest {

    @Autowired
    private EventService eventService;

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private EventRepository eventRepository;

    private Long testVenueId;

    @BeforeEach
    public void setup() {
        String uniqueId = java.util.UUID.randomUUID().toString();
        Venue venue = new Venue();
        venue.setVenueName("Concurrency Test Hall " + uniqueId);
        venue.setMinCapacity(100);
        venue.setMaxCapacity(200);
        venue.setRentalPrice(new java.math.BigDecimal("10000000"));
        venue.setAddress("123 Test St " + uniqueId);
        venue.setStatus("AVAILABLE");
        
        venue = venueRepository.save(venue);
        testVenueId = venue.getVenueId();
    }
    
    @AfterEach
    public void teardown() {
        eventRepository.deleteAll(eventRepository.findEventsInRange(
            OffsetDateTime.now().minusDays(1), 
            OffsetDateTime.now().plusDays(30)
        ).stream().filter(e -> e.getVenue().getVenueId().equals(testVenueId)).toList());
        venueRepository.deleteById(testVenueId);
    }

    @Test
    public void testConcurrentEventCreation_ShouldOnlyAllowOne() throws InterruptedException {
        int numberOfThreads = 5;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(numberOfThreads);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);

        OffsetDateTime start = OffsetDateTime.now().plusDays(10).withHour(18).withMinute(0);
        OffsetDateTime end = start.plusHours(4);

        for (int i = 0; i < numberOfThreads; i++) {
            final int threadNum = i;
            executorService.submit(() -> {
                try {
                    latch.await(); // Wait until all threads are ready
                    
                    EventRequest req = new EventRequest();
                    req.setVenueId(testVenueId);
                    req.setEventName("Concurrent Event " + threadNum);
                    req.setStartAt(start);
                    req.setEndAt(end);
                    req.setGuestCount(150);
                    
                    eventService.createEvent(req);
                    successCount.incrementAndGet();
                } catch (ResourceConflictException e) {
                    conflictCount.incrementAndGet();
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        // Release all threads simultaneously
        latch.countDown();
        
        doneLatch.await(10, TimeUnit.SECONDS);
        executorService.shutdown();

        // Exactly 1 thread should succeed, and 4 should fail with ResourceConflictException
        assertThat(successCount.get()).isEqualTo(1);
        assertThat(conflictCount.get()).isEqualTo(numberOfThreads - 1);
    }
}
