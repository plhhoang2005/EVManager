package com.evmanager.events;

import com.evmanager.events.dto.CalendarEventResponse;
import com.evmanager.events.dto.EventRequest;
import com.evmanager.events.dto.EventResponse;
import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.events.service.ConflictCheckerService;
import com.evmanager.events.service.EventService;
import com.evmanager.venues.model.Venue;
import com.evmanager.venues.repository.VenueRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TimezoneSynchronizationRegressionTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private VenueRepository venueRepository;

    @Mock
    private ConflictCheckerService conflictCheckerService;

    @InjectMocks
    private EventService eventService;

    private Venue testVenue;
    private final ZoneId vnZone = ZoneId.of("Asia/Ho_Chi_Minh");
    private final ZoneOffset vnOffset = ZoneOffset.ofHours(7);

    @BeforeEach
    void setUp() {
        testVenue = new Venue();
        testVenue.setVenueId(1L);
        testVenue.setVenueName("Sảnh Trống Đồng");
        testVenue.setStatus("AVAILABLE");
    }

    @Test
    @DisplayName("T01-T03: Event created at 17:30 UTC+7 round-trip preserves exact 17:30 without 1-hour shift")
    void testEventCreation_PreservesTimezoneAndHours() {
        // Event created at 17:30 on 2026-10-25 with +07:00
        OffsetDateTime start = OffsetDateTime.of(2026, 10, 25, 17, 30, 0, 0, vnOffset);
        OffsetDateTime end = OffsetDateTime.of(2026, 10, 25, 21, 30, 0, 0, vnOffset);

        EventRequest req = new EventRequest();
        req.setVenueId(1L);
        req.setEventName("Tiệc cưới Hoàng Gia");
        req.setStartAt(start);
        req.setEndAt(end);
        req.setGuestCount(200);

        when(venueRepository.findByIdWithPessimisticWriteLock(1L)).thenReturn(Optional.of(testVenue));
        when(eventRepository.save(any(Event.class))).thenAnswer(i -> {
            Event e = i.getArgument(0);
            e.setEventId(101L);
            return e;
        });

        EventResponse resp = eventService.createEvent(req);
        assertNotNull(resp);
        assertEquals(101L, resp.getEventId());

        // Assert start time preserved exactly 17:30
        assertEquals(17, resp.getStartAt().getHour(), "Hour must be 17:30 in VN time");
        assertEquals(30, resp.getStartAt().getMinute());
        assertEquals(vnOffset, resp.getStartAt().getOffset());
        assertEquals(2026, resp.getStartAt().getYear());
        assertEquals(Month.OCTOBER, resp.getStartAt().getMonth());
        assertEquals(25, resp.getStartAt().getDayOfMonth());
    }

    @Test
    @DisplayName("T04: Midnight edge 00:15 does not shift backward to previous date")
    void testEventNearMidnight_DoesNotShiftDate() {
        OffsetDateTime start = OffsetDateTime.of(2026, 11, 1, 0, 15, 0, 0, vnOffset);
        OffsetDateTime end = OffsetDateTime.of(2026, 11, 1, 4, 0, 0, 0, vnOffset);

        EventRequest req = new EventRequest();
        req.setVenueId(1L);
        req.setEventName("Gala Đêm 00h15");
        req.setStartAt(start);
        req.setEndAt(end);

        when(venueRepository.findByIdWithPessimisticWriteLock(1L)).thenReturn(Optional.of(testVenue));
        when(eventRepository.save(any(Event.class))).thenAnswer(i -> {
            Event e = i.getArgument(0);
            e.setEventId(102L);
            return e;
        });

        EventResponse resp = eventService.createEvent(req);
        assertEquals(1, resp.getStartAt().getDayOfMonth(), "Must remain Nov 1, not Oct 31");
        assertEquals(0, resp.getStartAt().getHour());
        assertEquals(15, resp.getStartAt().getMinute());
    }

    @Test
    @DisplayName("T05: Late night 23:45 does not shift forward to next date erroneously")
    void testEventLateNight_PreservesCorrectDate() {
        OffsetDateTime start = OffsetDateTime.of(2026, 12, 31, 23, 45, 0, 0, vnOffset);
        OffsetDateTime end = OffsetDateTime.of(2027, 1, 1, 2, 0, 0, 0, vnOffset);

        EventRequest req = new EventRequest();
        req.setVenueId(1L);
        req.setEventName("Countdown New Year");
        req.setStartAt(start);
        req.setEndAt(end);

        when(venueRepository.findByIdWithPessimisticWriteLock(1L)).thenReturn(Optional.of(testVenue));
        when(eventRepository.save(any(Event.class))).thenAnswer(i -> {
            Event e = i.getArgument(0);
            e.setEventId(103L);
            return e;
        });

        EventResponse resp = eventService.createEvent(req);
        assertEquals(2026, resp.getStartAt().getYear(), "Must start in 2026");
        assertEquals(31, resp.getStartAt().getDayOfMonth());
        assertEquals(2027, resp.getEndAt().getYear(), "End must cross over into 2027");
        assertEquals(1, resp.getEndAt().getDayOfMonth());
    }

    @Test
    @DisplayName("T07: Overnight event (22:00 -> 04:00 next day) correctly spans midnight")
    void testOvernightEvent_SpanAcrossMidnight() {
        OffsetDateTime start = OffsetDateTime.of(2026, 10, 15, 22, 0, 0, 0, vnOffset);
        OffsetDateTime end = OffsetDateTime.of(2026, 10, 16, 4, 0, 0, 0, vnOffset);

        EventRequest req = new EventRequest();
        req.setVenueId(1L);
        req.setEventName("Overnight Party");
        req.setStartAt(start);
        req.setEndAt(end);

        when(venueRepository.findByIdWithPessimisticWriteLock(1L)).thenReturn(Optional.of(testVenue));
        when(eventRepository.save(any(Event.class))).thenAnswer(i -> {
            Event e = i.getArgument(0);
            e.setEventId(104L);
            return e;
        });

        EventResponse resp = eventService.createEvent(req);
        assertTrue(resp.getEndAt().isAfter(resp.getStartAt()));
        assertEquals(6, Duration.between(resp.getStartAt(), resp.getEndAt()).toHours());
    }

    @Test
    @DisplayName("T11: Leap year date (2028-02-29) handled seamlessly")
    void testLeapYearDateHandling() {
        OffsetDateTime start = OffsetDateTime.of(2028, 2, 29, 11, 0, 0, 0, vnOffset);
        OffsetDateTime end = OffsetDateTime.of(2028, 2, 29, 14, 0, 0, 0, vnOffset);

        EventRequest req = new EventRequest();
        req.setVenueId(1L);
        req.setEventName("Leap Year Event");
        req.setStartAt(start);
        req.setEndAt(end);

        when(venueRepository.findByIdWithPessimisticWriteLock(1L)).thenReturn(Optional.of(testVenue));
        when(eventRepository.save(any(Event.class))).thenAnswer(i -> i.getArgument(0));

        EventResponse resp = eventService.createEvent(req);
        assertEquals(29, resp.getStartAt().getDayOfMonth());
        assertEquals(Month.FEBRUARY, resp.getStartAt().getMonth());
        assertEquals(2028, resp.getStartAt().getYear());
    }

    @Test
    @DisplayName("T12-T13: Instant representation between UTC (Z) and UTC+7 is identical in absolute time")
    void testInstantRepresentationEquivalence() {
        // 17:30 UTC+7 is identical to 10:30 UTC (Z)
        OffsetDateTime vnTime = OffsetDateTime.of(2026, 10, 25, 17, 30, 0, 0, vnOffset);
        OffsetDateTime utcTime = OffsetDateTime.of(2026, 10, 25, 10, 30, 0, 0, ZoneOffset.UTC);

        assertEquals(vnTime.toInstant(), utcTime.toInstant(), "Instant in time must be equal");
        assertEquals(vnTime.atZoneSameInstant(ZoneOffset.UTC), utcTime.atZoneSameInstant(ZoneOffset.UTC));
    }

    @Test
    @DisplayName("T24: Calendar event response mapping preserves start and end offsets")
    void testCalendarEventMapping_PreservesTimezone() {
        OffsetDateTime start = OffsetDateTime.of(2026, 10, 25, 18, 0, 0, 0, vnOffset);
        OffsetDateTime end = OffsetDateTime.of(2026, 10, 25, 22, 0, 0, 0, vnOffset);

        Event event = new Event();
        event.setEventId(200L);
        event.setVenue(testVenue);
        event.setEventName("Gala Dinner");
        event.setStartAt(start);
        event.setEndAt(end);
        event.setGuestCount(150);
        event.setStatus("SCHEDULED");

        when(eventRepository.findEventsInRange(any(), any())).thenReturn(List.of(event));

        List<CalendarEventResponse> calList = eventService.getEventsForCalendar(start.minusDays(1), end.plusDays(1));
        assertNotNull(calList);
        assertEquals(1, calList.size());

        CalendarEventResponse calEvent = calList.get(0);
        assertEquals("200", calEvent.getId());
        assertEquals("Gala Dinner", calEvent.getTitle());
        assertEquals(start, calEvent.getStart());
        assertEquals(end, calEvent.getEnd());
        assertEquals(18, calEvent.getStart().getHour());
    }

    @Test
    @DisplayName("T14-T16: Foreign timezone offsets (+09:00, -05:00) retain identical absolute instant without double +7h shift")
    void testForeignOffsets_PreservesAbsoluteInstant() {
        // 20:00 Tokyo (+09:00) is 18:00 Hanoi (+07:00)
        OffsetDateTime tokyoTime = OffsetDateTime.of(2026, 10, 25, 20, 0, 0, 0, ZoneOffset.ofHours(9));
        OffsetDateTime hanoiEquivalent = tokyoTime.atZoneSameInstant(vnZone).toOffsetDateTime();

        assertEquals(18, hanoiEquivalent.getHour(), "20:00 Tokyo must equal 18:00 Hanoi");
        assertEquals(tokyoTime.toInstant(), hanoiEquivalent.toInstant());

        // 06:00 New York (-05:00) is 18:00 Hanoi (+07:00)
        OffsetDateTime nyTime = OffsetDateTime.of(2026, 10, 25, 6, 0, 0, 0, ZoneOffset.ofHours(-5));
        OffsetDateTime hanoiFromNy = nyTime.atZoneSameInstant(vnZone).toOffsetDateTime();
        assertEquals(18, hanoiFromNy.getHour());
        assertEquals(nyTime.toInstant(), hanoiFromNy.toInstant());
    }

    @Test
    @DisplayName("T26: Microseconds precision in ISO-8601 string is preserved")
    void testMicrosecondsPrecision() {
        OffsetDateTime nanoTime = OffsetDateTime.parse("2026-10-25T17:30:00.123456+07:00");
        assertEquals(123456000, nanoTime.getNano());
        assertEquals(17, nanoTime.getHour());
        assertEquals(30, nanoTime.getMinute());
        assertEquals(vnOffset, nanoTime.getOffset());
    }
}
