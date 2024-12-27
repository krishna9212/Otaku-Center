import React from "react";

// Reusable Card Component
const ContactInfoCard = ({ icon, title, description, details, link }) => {
  return (
    <div className="w-full sm:w-1/3 text-center p-4">
      <span className="inline-block p-3 text-[#FACC15] rounded-full bg-blue-100/80 dark:bg-gray-800">
        {icon}
      </span>
      <h2 className="mt-4 text-lg font-medium text-gray-600">{title}</h2>
      <p className="mt-2 text-gray-500">{description}</p>
      <p className="mt-2 text-blue-500">
        {link ? <a href={`mailto:${link}`}>{link}</a> : details}
      </p>
    </div>
  );
};

function ContactUs() {
  return (
    <section className="bg-[#fcee91] py-12" id="contact">
      <div className="container px-6 mx-auto">
        <div className="text-center mb-12">
          <p className="font-semibold text-center capitalize text-gray-900 text-[3rem]">
            Connect with us, <span className="text-[#FACC15]">nakama!</span>
          </p>
          <p className="mt-3 text-center text-[1.2rem] text-gray-500">
            Seeking guidance or just want to say hello? Our team is your trusted{" "}
            <strong>sensei</strong>, guiding you every step of the way. <br />
            We're grateful for your support—<strong>arigato</strong>, nakama!{" "}
            <br />
            Let’s continue this epic journey together!
          </p>
        </div>

        <div className="flex flex-wrap justify-center mt-9">
          {/* Email Section */}
          <ContactInfoCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            }
            title="Raven Mail"
            description="Summon us with your words of power."
            link="konnichiwa@animeguild.com"
          />

          {/* Office Section */}
          <ContactInfoCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            }
            title="Guild HQ"
            description="Visit our secret base—adventure awaits!"
            details="123 Anime Street, Tokyo 100-0001"
          />

          {/* Phone Section */}
          <ContactInfoCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
            }
            title="Hotline"
            description="Call us—your senpais are listening."
            details="+91 85959 27668"
          />
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
