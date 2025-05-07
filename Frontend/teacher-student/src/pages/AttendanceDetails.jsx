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
        <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="flex items-center mb-8">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Attendance Details
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl shadow-sm border border-blue-200">
                    <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                        </svg>
                        <span className="text-gray-600 text-sm font-medium">Entry Time</span>
                    </div>
                    <p className="text-xl font-bold text-gray-800">{firstTime}</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl shadow-sm border border-red-200">
                    <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        <span className="text-gray-600 text-sm font-medium">Exit Time</span>
                    </div>
                    <p className="text-xl font-bold text-gray-800">{lastTime}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl shadow-sm border border-green-200">
                    <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-gray-600 text-sm font-medium">Duration</span>
                    </div>
                    <p className="text-xl font-bold text-green-800">{duration}</p>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        Attendance Log
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {attendanceLog.length} Records
                    </span>
                </div>

                {attendanceLog.length > 0 ? (
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                        Entry #
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Timestamp
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendanceLog.map((time, index) => (
                                    <tr
                                        key={index}
                                        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors duration-150 ease-in-out`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                                            <span className="flex items-center">
                                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-xs mr-2">
                                                    {index + 1}
                                                </span>
                                                Entry {index + 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                {time}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="text-red-700 font-medium">
                                No attendance records available.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceDetails;