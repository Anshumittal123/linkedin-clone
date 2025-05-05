import React, { useEffect, useState } from 'react';

const JobApplyPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('https://remoteok.com/api');
        const data = await res.json();
        // API returns an array with the first item as metadata, skip it
        const jobList = data.slice(1);
        setJobs(jobList);
        setFilteredJobs(jobList);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const matchTitle = job.position?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLocation = job.location?.toLowerCase().includes(locationFilter.toLowerCase());
      return matchTitle && matchLocation;
    });
    setFilteredJobs(filtered);
  }, [searchTerm, locationFilter, jobs]);

  return (
    <section className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6 text-black">Explore Remote Jobs</h2>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by job title..."
          className="p-2 border rounded w-72 text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search by location..."
          className="p-2 border rounded w-72 text-black"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
      </div>

      <div className="grid gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white shadow p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-black">{job.position}</h3>
            <p className="text-gray-600">{job.company} — {job.location}</p>
            <div
              className="text-sm mt-2 text-gray-700"
              dangerouslySetInnerHTML={{ __html: job.description?.slice(0, 300) + '...' }}
            />
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View Job →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JobApplyPage;
