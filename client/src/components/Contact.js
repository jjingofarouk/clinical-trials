import React from 'react';

const Contact = () => (
  <div className="max-w-4xl mx-auto p-4 my-3 bg-white rounded-2xl">
    <h1 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h1>
    <p className="text-sm text-gray-600 leading-relaxed mb-4">
      Have questions or need assistance? Reach out to our team for support regarding clinical trials or general inquiries.
    </p>
    <form className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-900 mb-1">Name</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-100 rounded-xl text-sm text-gray-900"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-900 mb-1">Email</label>
        <input
          type="email"
          className="w-full p-2 border border-gray-100 rounded-xl text-sm text-gray-900"
          placeholder="Your email"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-900 mb-1">Message</label>
        <textarea
          className="w-full p-2 border border-gray-100 rounded-xl text-sm text-gray-900"
          rows="4"
          placeholder="Your message"
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-[#000000] text-white text-sm font-medium px-4 py-2 rounded-xl"
      >
        Send Message
      </button>
    </form>
    <style jsx>{`
      * {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      @media (max-width: 640px) {
        .rounded-2xl {
          border-radius: 12px;
        }

        .p-4 {
          padding: 12px;
        }

        .my-3 {
          margin-top: 12px;
          margin-bottom: 12px;
        }

        .text-lg {
          font-size: 16px;
        }

        .text-sm {
          font-size: 12px;
        }

        .text-xs {
          font-size: 11px;
        }

        .mb-4 {
          margin-bottom: 12px;
        }

        .space-y-3 {
          gap: 8px;
        }

        .p-2 {
          padding: 8px;
        }

        .px-4 {
          padding-left: 16px;
          padding-right: 16px;
        }

        .py-2 {
          padding-top: 8px;
          padding-bottom: 8px;
        }

        .max-w-4xl {
          margin-left: 12px;
          margin-right: 12px;
        }
      }

      @media (min-width: 641px) and (max-width: 1023px) {
        .rounded-2xl {
          border-radius: 14px;
        }
      }
    `}</style>
  </div>
);

export default Contact;