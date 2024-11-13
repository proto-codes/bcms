export const addEventToCalendar = ({ title, date, startTime, endTime, location, description }) => {
    // Format date and time for calendar links (Date and time format)
    const eventStart = new Date(`${date}T${startTime}`).toISOString().replace(/-|:|\.\d{3}/g, '');
    const eventEnd = new Date(new Date(`${date}T${startTime}`).getTime() + 60 * 60 * 1000)
      .toISOString()
      .replace(/-|:|\.\d{3}/g, '');
  
    // URLs for Google and Outlook calendar events
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${eventStart}/${eventEnd}&details=${encodeURIComponent(
      description
    )}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
  
    const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(description)}&startdt=${eventStart}&enddt=${eventEnd}&location=${encodeURIComponent(location)}`;
  
    // Open a modal or prompt for the user to select the calendar, or open Google Calendar link directly
    const userChoice = window.confirm("Add event to Google Calendar? Press Cancel to add to Outlook Calendar.");
    const calendarUrl = userChoice ? googleCalendarUrl : outlookCalendarUrl;
  
    // Open the calendar link in a new tab
    window.open(calendarUrl, '_blank');
  };
  