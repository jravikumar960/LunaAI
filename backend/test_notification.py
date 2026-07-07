from winotify import Notification

toast = Notification(
    app_id="Luna",
    title="Luna Reminder",
    msg="Hello Ravi! This is a test notification.",
)

toast.show()