import { add, eachDayOfInterval, endOfWeek, format, getDay, isEqual, isSameDay, isSameMonth, isToday, parse, parseISO, startOfToday, startOfWeek } from "date-fns"
import { endOfMonth } from "date-fns/fp"
import { ChevronLeftIcon, ChevronRightIcon  } from "lucide-react"
import { useState } from "react";

function classNames(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const events = [
  {
    id: 1,
    title: 'Escape from Tarkov',
    desciption: 'Unheard Edition',
    cost: 20000,
    startDatetime: '2024-12-26T12:00',
    endDatetime: '2025-02-01T19:00',
  },
]
function isDayInEventRange(day: Date, event: { startDatetime: string; endDatetime: string }): boolean {
  const start = parseISO(event.startDatetime);
  const end = parseISO(event.endDatetime);
  return isSameDay(day, start) || isSameDay(day, end) || (day > start && day < end);
}
export default function DatePickerWithRange() {
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(today)
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
  
  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }
  
  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }
  let days = eachDayOfInterval({ 
    start: startOfWeek(firstDayCurrentMonth), 
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  })
  let selectedDayMeetings = events.filter((event) =>
    isDayInEventRange(selectedDay, event)
  )
return (
  <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-gray-200 min-w-[20rem] s:min-w-[25rem] sm:min-w-[34rem] md:min-w-[45rem] lg:min-w-[55rem] xl:min-w-[65rem] 2xl:min-w-[75rem]">
    <div className="lg:pr-14">
      <div className="flex items-center">
        <h2 className="flex-auto font-semibold text-white">
          {format(firstDayCurrentMonth, 'MMMM yyyy')}
        </h2>
        <button
          type="button"
          onClick={previousMonth}
          className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          onClick={nextMonth}
          type="button"
          className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
      <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-400">
        <div>So</div>
        <div>Mo</div>
        <div>Di</div>
        <div>Mi</div>
        <div>Do</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>
      <div className="grid grid-cols-7 mt-2 text-sm">
        {days.map((day, dayIdx) => (
          <div
            key={day.toString()}
            className={classNames(
              dayIdx === 0 && colStartClasses[getDay(day)],
              'py-1.5 relative'
            )}
          >
            <button
              type="button"
              onClick={() => setSelectedDay(day)}
              className={classNames(
                isEqual(day, selectedDay) && 'text-white',
                !isEqual(day, selectedDay) && isToday(day) && 'text-red-500',
                !isEqual(day, selectedDay) && !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && 'text-white',
                !isEqual(day, selectedDay) && !isToday(day) && !isSameMonth(day, firstDayCurrentMonth) && 'text-gray-700',
                isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                isEqual(day, selectedDay) && !isToday(day) && 'bg-gray-400',
                !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                (isEqual(day, selectedDay) || isToday(day)) && 'font-semibold',
                'mx-auto flex h-8 w-8 items-center justify-center rounded-full relative'
              )}
            >
              <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
            </button>

            {events.map((event) =>
              isDayInEventRange(day, event) ? (
                <div
                  key={event.id}
                  className="absolute inset-0 mx-auto mt-10 h-1 w-4 bg-blue-500 rounded-full"
                ></div>
              ) : null
            )}
            
          </div>
        ))}
      </div>
    </div>
  
    <section className="mt-12 lg:mt-0 lg:pl-14 text-center lg:text-left">
      <h2 className="font-semibold text-white">
        Event Zum{' '}
        <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
          {format(selectedDay, 'MMM dd, yyy')}
        </time>
      </h2>
      <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
        {selectedDayMeetings.length > 0 ? (
          selectedDayMeetings.map((event) => (
            <div className="border rounded-md p-2 text-white" key={event.id}>
              <div className="head">
                {event.title}
              </div>
              <div className="body">
                Belohnung{": "} {event.desciption}
              </div>
              <div className="cost flex items-center justify-center lg:justify-normal">
                Kosten:
                {event.cost !== 0 ? (
                  <span className="flex items-center ml-1">
                    {event.cost}
                    <img
                      className="w-5 h-5 ml-1"
                      src="https://static-cdn.jtvnw.net/channel-points-icons/86551629/18aa7b8b-3df0-4f58-9109-8f075286dc21/icon-1.png"
                      alt="Cost icon"
                    />
                  </span>
                ) : (
                  <span className="ml-1">free</span>
                )}
              </div>

              <div className="time">
                <p className="mt-0.5">
                  <time dateTime={event.startDatetime}>
                    {format(event.startDatetime, 'LLL dd h:mm a')}
                  </time>{' '}
                  -{' '}
                  <time dateTime={event.endDatetime}>
                    {format(event.endDatetime, 'LLL dd h:mm a')}
                  </time>
                </p>
              </div>
            </div>

          ))
        ) : (
          <p>Kein Event für heute.</p>
        )}
      </ol>
    </section>

  </div>
  )
}


let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]