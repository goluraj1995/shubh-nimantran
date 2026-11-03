import React from 'react';
import { Calendar as CalendarIcon, Download, ExternalLink } from 'lucide-react';

interface SaveTheDateCalendarProps {
  weddingDateIso: string;
  groomName: string;
  brideName: string;
  venueName: string;
  venueAddress: string;
  weddingDateDisplay: string;
}

export const SaveTheDateCalendar: React.FC<SaveTheDateCalendarProps> = ({
  weddingDateIso,
  groomName,
  brideName,
  venueName,
  venueAddress,
  weddingDateDisplay
}) => {
  const dateObj = new Date(weddingDateIso);
  const year = dateObj.getFullYear() || 2027;
  const monthNamesHindi = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];
  const monthHindi = monthNamesHindi[dateObj.getMonth()] || 'मार्च';
  const selectedDay = dateObj.getDate() || 20;

  // Google Calendar URL with Hindi Event Details
  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`${groomName} संग ${brideName} - शुभ विवाह समारोह`);
    const details = encodeURIComponent(
      `परमपिता परमेश्वर के आशीर्वाद से ${groomName} एवं ${brideName} का शुभ विवाह उत्सव।\nविवाह स्थल: ${venueName}, ${venueAddress}`
    );
    const location = encodeURIComponent(`${venueName}, ${venueAddress}`);
    const startDate = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDateObj = new Date(dateObj.getTime() + 6 * 3600 * 1000);
    const endDate = endDateObj.toISOString().replace(/-|:|\.\d\d\d/g, '');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  };

  // Download .ics file
  const handleDownloadIcs = () => {
    const title = `${groomName} संग ${brideName} - शुभ विवाह`;
    const details = `हमारा शुभ विवाह समारोह। स्थान: ${venueName}`;
    const location = `${venueName}, ${venueAddress}`;
    
    const startDate = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDateObj = new Date(dateObj.getTime() + 6 * 3600 * 1000);
    const endDate = endDateObj.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Shubh Vivah Digital Invitation//HI
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${details}
LOCATION:${location}
DTSTART:${startDate}
DTEND:${endDate}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Shubh_Vivah_${groomName}_${brideName}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Days of week in Hindi: रवि, सोम, मंगल, बुध, गुरु, शुक्र, शनि
  const daysOfWeekHindi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
  const daysInMonth = new Date(year, dateObj.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(year, dateObj.getMonth(), 1).getDay();

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="w-full max-w-sm bg-[#fffaf0] border-2 border-[#d4af37] rounded-3xl p-6 shadow-xl card-paper-traditional relative text-center">
        {/* Month Header in Hindi */}
        <div className="flex items-center justify-between border-b border-[#b8860b]/30 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#87091f]" />
            <span className="font-devanagari-royal font-bold text-lg text-[#630514]">
              {monthHindi} {year}
            </span>
          </div>
          <span className="text-[11px] font-devanagari-serif text-[#87091f] font-bold border border-[#b8860b]/40 bg-[#fdf6e7] px-2.5 py-0.5 rounded-full">
            तारीख याद रखें
          </span>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {daysOfWeekHindi.map((day, idx) => (
            <div key={idx} className="text-xs font-devanagari-serif font-bold text-[#87091f] py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Dates Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {daysArray.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-9"></div>;
            }
            const isSelected = day === selectedDay;

            return (
              <div
                key={day}
                className={`h-9 flex items-center justify-center rounded-full text-xs font-devanagari-serif transition-all ${
                  isSelected
                    ? 'bg-gradient-to-tr from-[#87091f] via-[#b22222] to-[#ff4d4d] text-[#ffd700] font-bold ring-4 ring-[#ffd700]/50 shadow-lg scale-110 relative'
                    : 'text-stone-800 hover:bg-[#f3e5ab]/40'
                }`}
              >
                {day}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 text-[10px] text-[#ffd700]">★</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 text-xs font-devanagari-serif text-[#87091f] font-semibold">
          शुभ विवाह दिवस: {weddingDateDisplay}
        </div>

        {/* Action Buttons in Hindi */}
        <div className="mt-5 pt-4 border-t border-[#b8860b]/30 flex flex-col gap-2.5">
          <a
            href={createGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#87091f] to-[#54030f] hover:from-[#630514] hover:to-[#3e020a] text-[#ffd700] text-xs font-devanagari-serif font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <ExternalLink className="w-4 h-4 text-[#ffd700]" />
            <span>गूगल कैलेंडर में जोड़ें (Google Calendar)</span>
          </a>

          <button
            onClick={handleDownloadIcs}
            className="w-full py-2 px-4 bg-[#fdf6e7] hover:bg-[#f8eed5] border border-[#b8860b]/60 text-[#630514] text-xs font-devanagari-serif font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-[#87091f]" />
            <span>कैलेंडर इवेंट फाइल डाउनलोड करें (.ics)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
