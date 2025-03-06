import { useLocation } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BASE_URL;

const AttendanceDetails = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const firstTime = queryParams.get("firstTime");
    const lastTime = queryParams.get("lastTime");
    const duration = queryParams.get("duration");

    // Decode and parse the attendance array from the URL
    const attendanceLog = queryParams.get("attendance")
        ? JSON.parse(decodeURIComponent(queryParams.get("attendance")))
        : [];

    return (
        <div className="p-4 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6 border-b pb-3">
                Attendance Details 
            </h1>

            <div className="grid grid-cols-3 gap-6 text-lg font-medium mb-8">
                <div className="bg-gray-100 p-4 rounded-md">
                    <span className="text-gray-600"> Entry Time:</span>
                    <p className="text-gray-900 font-semibold">{firstTime}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-md">
                    <span className="text-gray-600"> Exit Time:</span>
                    <p className="text-gray-900 font-semibold">{lastTime}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-md">
                    <span className="text-gray-600"> Duration:</span>
                    <p className="text-gray-900 font-semibold">{duration}</p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
                Attendance Log 
            </h2>

            {attendanceLog.length > 0 ? (
                <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left border">#</th>
                                <th className="py-3 px-6 text-left border">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 text-sm font-medium">
                            {attendanceLog.map((time, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-50`}
                                >
                                    <td className="py-3 px-6 border">{index + 1}</td>
                                    <td className="py-3 px-6 border">{time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-lg text-red-500 font-semibold mt-6">
                    ❌ No attendance records available.
                </p>
            )}
        </div>
    );
};

export default AttendanceDetails;
