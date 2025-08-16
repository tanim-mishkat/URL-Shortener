import React from "react";
import { Link } from "@tanstack/react-router";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-200">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">URLShort</h2>
                <p className="text-xs text-slate-500">Link Shortener</p>
              </div>
            </Link>

            <p className="text-slate-600 mt-4">
              Transform long, complex URLs into clean, trackable links.
            </p>

            {/* Socials */}
            <div className="flex items-center space-x-3 mt-4">
              <SocialIcon href="#" label="Twitter">
                <path d="M8 19c7.5 0 11.6-6.3 11.6-11.8v-.5A8.3 8.3 0 0022 4.6a8.2 8.2 0 01-2.3.7A4 4 0 0021.4 3a8.4 8.4 0 01-2.6 1 4 4 0 00-6.9 3.6 11.5 11.5 0 01-8.3-4.3 4 4 0 001.2 5.3 4 4 0 01-1.8-.5v.1a4 4 0 003.2 3.9 4 4 0 01-1.8.1 4 4 0 003.7 2.8A8.1 8.1 0 012 17.5a11.5 11.5 0 006 1.8" />
              </SocialIcon>
              <SocialIcon href="#" label="Github">
                <path
                  fillRule="evenodd"
                  d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.2-1.4-1.2-1.4-1-.7.1-.7.1-.7 1.1.1 1.6 1.2 1.6 1.2 1 .1.8-.8 2.8-.9-2.2-.3-3.4-1.1-3.4-3.6 0-.8.3-1.5.8-2.1-.1-.3-.3-1.1.1-2.3 0 0 .7-.2 2.2.8a7.6 7.6 0 014 0c1.4-1 2.2-.8 2.2-.8.4 1.2.2 2 .1 2.3.5.6.8 1.3.8 2.1 0 2.5-1.2 3.3-3.4 3.6.8.1 1.5.6 1.5 1.9v2.7c0 .3.2.6.7.5A10 10 0 0012 2z"
                  clipRule="evenodd"
                />
              </SocialIcon>
              <SocialIcon href="#" label="LinkedIn">
                <path d="M16 8a6 6 0 016 6v7h-4v-6c0-2-1.6-3.5-3.5-3.5S11 13 11 15v6H7V9h4v2a5 5 0 014-3zM5 9H1v12h4V9zM3 3a2 2 0 100 4 2 2 0 000-4z" />
              </SocialIcon>
            </div>
          </div>

          {/* Product */}
          <FooterCol title="Product">
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/services">Services</FooterLink>
            <FooterLink to="/about">About</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
          </FooterCol>

          {/* Resources */}
          <FooterCol title="Resources">
            <FooterLink to="/docs">Docs</FooterLink>
            <FooterLink to="/pricing">Pricing</FooterLink>
            <FooterLink to="/blog">Blog</FooterLink>
            <FooterLink to="/status">Status</FooterLink>
          </FooterCol>

          {/* Legal */}
          <FooterCol title="Legal">
            <FooterLink to="/privacy">Privacy</FooterLink>
            <FooterLink to="/terms">Terms</FooterLink>
            <FooterLink to="/cookie">Cookie Policy</FooterLink>
            <FooterLink to="/security">Security</FooterLink>
          </FooterCol>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} URLShort. All rights reserved.
          </p>

          <div className="mt-3 sm:mt-0 flex items-center space-x-4">
            <Link
              to="/privacy"
              className="text-sm text-slate-500 hover:text-blue-700 hover:underline"
            >
              Privacy
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/terms"
              className="text-sm text-slate-500 hover:text-blue-700 hover:underline"
            >
              Terms
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/contact"
              className="text-sm text-slate-500 hover:text-blue-700 hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterCol = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">
      {title}
    </h3>
    <ul className="mt-4 space-y-2">{children}</ul>
  </div>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-slate-600 hover:text-blue-700 hover:underline transition-colors duration-200"
    >
      {children}
    </Link>
  </li>
);

const SocialIcon = ({ href, label, children }) => (
  <a
    href={href}
    aria-label={label}
    className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-700 hover:border-blue-200 transition"
  >
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  </a>
);

export default Footer;
