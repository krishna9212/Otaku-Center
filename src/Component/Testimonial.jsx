import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Aakash Verma",
      quote:
        "The anime figures I bought from otaku centre are top quality! The attention to detail is amazing, and my collection has never looked better.",
      imgSrc:
        "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTM2fHxpbmRpYW4lMjBmYWNlfGVufDB8fDB8fHww",
    },
    {
      name: "Nina Patel",
      quote:
        "As a die-hard anime fan, I can say that otaku centre's selection of action figures is unmatched. These collectibles are definitely worth every penny.",
      imgSrc: "https://randomuser.me/api/portraits/women/15.jpg",
    },
    {
      name: "Rajiv Sharma",
      quote:
        "I’ve been searching for rare anime figures for a while, and otaku centre delivered. The packaging was perfect, and the figures are just what I wanted!",
      imgSrc:
        "https://images.unsplash.com/photo-1629269715587-5003f2ce745a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjN8fGluZGlhbiUyMGZhY2V8ZW58MHx8MHx8fDA%3D",
    },
  ];

  return (
    <section
      id="testimonials"
      aria-label="What our customers are saying"
      className="bg-[#faed97] pt-10 pb-20" // Updated background color
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display capitalize text-center text-[3rem] pt-3 tracking-tight text-slate-900">
            What Our Customers Are Saying
          </h2>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <li key={index}>
              <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                <li>
                  <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10 hover:shadow-[#f5c484] transition-all duration-300">
                    <svg
                      aria-hidden="true"
                      width="105"
                      height="78"
                      className="absolute left-6 top-6 fill-slate-100"
                    >
                      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z"></path>
                    </svg>
                    <blockquote className="relative">
                      <p className="text-lg tracking-tight text-slate-900">
                        {testimonial.quote}
                      </p>
                    </blockquote>
                    <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                      <div>
                        <div className="font-display text-base text-slate-900">
                          {testimonial.name}
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-full bg-slate-50">
                        <img
                          alt={testimonial.name}
                          className="h-14 w-14 object-cover"
                          src={testimonial.imgSrc}
                        />
                      </div>
                    </figcaption>
                  </figure>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Testimonials;
