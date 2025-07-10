// ✅ Top-level component mocks (before imports)
jest.mock("../../components/OtpGet", () => ({
  __esModule: true,
  default: () => <div data-testid="otp-get">Mocked OtpGet</div>,
}));
jest.mock("../../components/OtpVerify", () => ({
  __esModule: true,
  default: () => <div data-testid="otp-verify">Mocked OtpVerify</div>,
}));
jest.mock("../../components/Pin", () => ({
  __esModule: true,
  default: () => <div data-testid="pin">Mocked Pin</div>,
}));
jest.mock("../../components/L1Biometrics", () => ({
  __esModule: true,
  default: () => <div data-testid="l1biometrics">Mocked Biometrics</div>,
}));
jest.mock("../../components/LoginQRCode", () => ({
  __esModule: true,
  default: () => <div data-testid="qrcode">Mocked QRCode</div>,
}));
jest.mock("../../components/Password", () => ({
  __esModule: true,
  default: () => <div data-testid="password">Mocked Password</div>,
}));
jest.mock("../../components/Form", () => ({
  __esModule: true,
  default: () => <div data-testid="form">Mocked Form</div>,
}));

// ✅ React + tools
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../../pages/Login";
import * as buffer from "buffer";

// ✅ Mocks for react-router-dom hooks
const mockedUseLocation = jest.fn();
const mockedUseSearchParams = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => mockedUseLocation(),
    useSearchParams: () => mockedUseSearchParams(),
  };
});

// ✅ Correct openIDConnectService mock
jest.mock("../../services/openIDConnectService", () => ({
  getOAuthDetails: jest.fn(() => ({
    logoUrl: "logo.png",
    clientName: { en: "Test Client" },
  })),
  getPurpose: jest.fn(() => ({
    type: "login",
    title: { en: "Login Title" },
    subTitle: { en: "Login Subtitle" },
  })),
  getEsignetConfiguration: jest.fn(() => ""),
  getAuthFactorList: jest.fn(() => []),
}));

jest.mock("../../services/authService", () => jest.fn());
jest.mock("../../services/sbiService", () => jest.fn());
jest.mock("../../services/langConfigService", () => ({
  getLangCodeMapping: jest.fn(() => Promise.resolve({ en: "en" })),
  getEnLocaleConfiguration: jest.fn(() => Promise.resolve({})),
}));

// ✅ Mock UI components
jest.mock("../../components/Background", () => ({
  __esModule: true,
  default: jest.fn(({ heading, subheading }) => (
    <div>
      <div data-testid="background-heading">{heading}</div>
      <div data-testid="background-subheading">{subheading}</div>
    </div>
  )),
}));

jest.mock("../../components/SignInOptions", () => () => (
  <div data-testid="sign-in-options">Sign In Options</div>
));

jest.mock("../../components/DefaultError", () => ({ errorCode }) => (
  <div data-testid="default-error">{errorCode}</div>
));

// ✅ i18n mock
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "en" },
  }),
}));

// ✅ Utility to encode hash
const encodeHash = (obj) =>
  `#${buffer.Buffer.from(JSON.stringify(obj)).toString("base64")}`;

// ✅ Test Suite
describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseSearchParams.mockReturnValue([
      new URLSearchParams("nonce=abc&state=xyz"),
      jest.fn(),
    ]);
  });

  it("renders DefaultError on invalid base64 JSON", () => {
    mockedUseLocation.mockReturnValue({
      hash: `#${buffer.Buffer.from("invalid-json").toString("base64")}`,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("default-error")).toHaveTextContent(
      "parsing_error_msg"
    );
  });

  it("renders DefaultError on empty hash", () => {
    mockedUseLocation.mockReturnValue({ hash: "" });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("default-error")).toHaveTextContent(
      "parsing_error_msg"
    );
  });

  it("renders Background and SignInOptions on valid base64 JSON", async () => {
    mockedUseLocation.mockReturnValue({ hash: encodeHash({ some: "data" }) });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("background-heading")).toHaveTextContent(
        "login"
      );
      expect(screen.getByTestId("background-subheading")).toHaveTextContent(
        "login"
      );
      expect(screen.getByTestId("sign-in-options")).toBeInTheDocument();
    });
  });

  it("renders OtpGet for authFactorType = otp_get", async () => {
    mockedUseLocation.mockReturnValue({
      hash: encodeHash({ authFactorType: "otp_get" }),
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("otp-get")).toBeInTheDocument();
    });
  });

  it("renders OtpVerify for authFactorType = otp_verify", async () => {
    mockedUseLocation.mockReturnValue({
      hash: encodeHash({ authFactorType: "otp_verify" }),
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("otp-verify")).toBeInTheDocument();
    });
  });

  it("renders Pin for authFactorType = pin", async () => {
    mockedUseLocation.mockReturnValue({
      hash: encodeHash({ authFactorType: "pin" }),
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("pin")).toBeInTheDocument();
    });
  });

  it("renders L1Biometrics for authFactorType = l1_biometrics", async () => {
    mockedUseLocation.mockReturnValue({
      hash: encodeHash({ authFactorType: "l1_biometrics" }),
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("l1biometrics")).toBeInTheDocument();
    });
  });

  it("renders QRCode for authFactorType = qrcode", async () => {
    mockedUseLocation.mockReturnValue({
      hash: encodeHash({ authFactorType: "qrcode" }),
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("qrcode")).toBeInTheDocument();
    });
  });

  it("renders Password for authFactorType = password", async () => {
    mockedUseLocation.mockReturnValue({
      hash: encodeHash({ authFactorType: "password" }),
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("password")).toBeInTheDocument();
    });
  });

  it("renders Form for unknown authFactorType", async () => {
    mockedUseLocation.mockReturnValue({
      hash: encodeHash({ authFactorType: "something_else" }),
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("form")).toBeInTheDocument();
    });
  });

  it("still renders correctly without nonce and state in searchParams", async () => {
    mockedUseSearchParams.mockReturnValue([
      new URLSearchParams("foo=bar"),
      jest.fn(),
    ]);
    mockedUseLocation.mockReturnValue({
      hash: encodeHash({ authFactorType: "otp_get" }),
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("otp-get")).toBeInTheDocument();
    });
  });
});
