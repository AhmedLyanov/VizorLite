import type { SVGProps } from "react";

export const icons = {
  settings: (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),

  home: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3 12l9-9 9 9v9H3z" />
    </svg>
  ),

  community: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M13 13C15.2091 13 17 14.7909 17 17V18.5C17 19.3284 16.3284 20 15.5 20H3.5C2.67157 20 2 19.3284 2 18.5V17C2 14.7909 3.79086 13 6 13H13Z"
        fill="#09244B"
      />
      <path
        d="M19 13.0002C20.6569 13.0002 22 14.3434 22 16.0002V17.5002C22 18.3287 21.3284 19.0002 20.5 19.0002H19V17C19 15.3645 18.2148 13.9125 17.0008 13.0002H19Z"
        fill="#09244B"
      />
      <path
        d="M9.5 3C11.9853 3 14 5.01472 14 7.5C14 9.98528 11.9853 12 9.5 12C7.01472 12 5 9.98528 5 7.5C5 5.01472 7.01472 3 9.5 3Z"
        fill="#09244B"
      />
      <path
        d="M18 6C19.6569 6 21 7.34315 21 9C21 10.6569 19.6569 12 18 12C16.3431 12 15 10.6569 15 9C15 7.34315 16.3431 6 18 6Z"
        fill="#09244B"
      />
    </svg>
  ),

  mail: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 30 30" fill="none" {...props}>
      <style>{`.st7{fill:#FFDF1D;}`}</style>
      <path
        className="st7"
        d="M25,6H5C3.9,6,3,6.9,3,8v14c0,1.1,0.9,2,2,2h20c1.1,0,2-0.9,2-2V8C27,6.9,26.1,6,25,6z M23.8,10l-8.1,6.4 c-0.4,0.3-1,0.3-1.5,0l-8-6.3C5.9,9.9,5.8,9.4,6.1,9c0.3-0.3,0.7-0.4,1.1-0.2L15,14l7.9-5.2c0.4-0.2,0.9-0.1,1.1,0.2 C24.2,9.3,24.1,9.8,23.8,10z"
      />
    </svg>
  ),

  history: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4V18C5 19.6569 6.34315 21 8 21H18C19.6569 21 21 19.6569 21 18V8C21 6.34315 19.6569 5 18 5H6C5.44772 5 5 4.55228 5 4ZM8.25 11C8.25 10.5858 8.58579 10.25 9 10.25H17C17.4142 10.25 17.75 10.5858 17.75 11C17.75 11.4142 17.4142 11.75 17 11.75H9C8.58579 11.75 8.25 11.4142 8.25 11ZM8.25 14.5C8.25 14.0858 8.58579 13.75 9 13.75H14.5C14.9142 13.75 15.25 14.0858 15.25 14.5C15.25 14.9142 14.9142 15.25 14.5 15.25H9C8.58579 15.25 8.25 14.9142 8.25 14.5Z"
        fill="#1C274D"
      />
      <path
        opacity="0.5"
        d="M19 4V5.865C18.6872 5.75445 18.3506 5.6943 18 5.6943H6C5.44772 5.6943 5 5.24658 5 4.6943V4.62325C5 4.09023 5.39193 3.63833 5.91959 3.56295L16.7172 2.02044C17.922 1.84831 19 2.78324 19 4.00034V4Z"
        fill="#1C274D"
      />
    </svg>
  ),

  cardBank: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <style>
        {`
          .st0{fill:#B4E6DD;}
          .st1{fill:#80D4C4;}
          .st2{fill:#D2F0EA;}
          .st3{fill:#FFFFFF;}
          .st4{fill:#FBD872;}
          .st5{fill:#DB7767;}
          .st6{fill:#F38E7A;}
          .st7{fill:#F6AF62;}
          .st8{fill:#32A48E;}
          .st9{fill:#A38FD8;}
          .st10{fill:#7C64BD;}
          .st11{fill:#EAA157;}
          .st12{fill:#9681CF;}
          .st13{fill:#F9C46A;}
          .st14{fill:#CE6B61;}
        `}
      </style>
      <path
        className="st9"
        d="M52,10.51H12c-2.21,0-4,1.79-4,4v22.16c0,2.21,1.79,4,4,4h40c2.21,0,4-1.79,4-4V14.51C56,12.3,54.21,10.51,52,10.51z"
      />
      <rect className="st10" x="8" y="16.29" width="48" height="5.78" />
      <circle className="st3" cx="14.36" cy="27.31" r="2.89" />
    </svg>
  ),

  // Bottom menu buttons
  translate: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M27.85,29H30L24,14H21.65l-6,15H17.8l1.6-4h6.85ZM20.2,23l2.62-6.56L25.45,23Z" />
      <path d="M18,7V5H11V2H9V5H2V7H12.74a14.71,14.71,0,0,1-3.19,6.18A13.5,13.5,0,0,1,7.26,9H5.16a16.47,16.47,0,0,0,3,5.58A16.84,16.84,0,0,1,3,18l.75,1.86A18.47,18.47,0,0,0,9.53,16a16.92,16.92,0,0,0,5.76,3.84L16,18a14.48,14.48,0,0,1-5.12-3.37A17.64,17.64,0,0,0,14.8,7Z" />
      <rect width="32" height="32" fill="none" />
    </svg>
  ),
};

export type IconName = keyof typeof icons;