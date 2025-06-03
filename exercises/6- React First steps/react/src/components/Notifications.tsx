import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeNotification } from "../store/uiSlice";
import { useEffect } from "react";

export function Notifications() {
    const notifications = useAppSelector(state => state.ui.notifications);
    const dispatch = useAppDispatch();

    useEffect(() => {
        notifications.map(notification => {
            return setTimeout(() => {
                dispatch(removeNotification(notification.id));
            }, notification.duration || 3000);
        });
    }, [notifications, dispatch]);

    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`p-3 rounded shadow-md ${
            notification.type === 'success' ? 'bg-green-500' :
            notification.type === 'error' ? 'bg-red-500' :
            notification.type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          } text-white`}
        >
          {notification.message}
          <button
            className="ml-2 text-white"
            onClick={() => dispatch(removeNotification(notification.id))}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
    )


}
