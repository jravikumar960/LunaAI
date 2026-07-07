import threading
import time
from datetime import datetime

from automation import (
    get_automation,
    delete_automation,
)


def reminder_loop():

    print("Reminder service started")

    while True:

        print("Checking reminders...")

        reminders = get_automation()

        print(reminders)

        now = datetime.now()

        for reminder in reminders:

            try:

                remind_time = datetime.fromisoformat(
                    reminder["remind_at"]
                )

                print("Current:", now)
                print("Reminder:", remind_time)

                if now >= remind_time:

                    print("🔔 Reminder Triggered")
                    print(reminder["title"])

                    delete_automation(reminder["id"])

            except Exception as e:
                print(e)

        time.sleep(10)


def start_reminder_service():

    thread = threading.Thread(
        target=reminder_loop,
        daemon=True,
    )

    thread.start()