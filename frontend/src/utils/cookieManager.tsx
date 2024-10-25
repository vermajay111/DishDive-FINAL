import Cookies from "js-cookie";

export function setCookieByDays(
  cookieName: string,
  cookieValue: string,
  expirationDays: number
) {
  try {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);
    Cookies.set(cookieName, cookieValue, { expires: expirationDate });
    return true;
  } catch {
    return false;
  }
}

export function setCookieByMinutes(
  cookieName: string,
  cookieValue: string,
  expirationMinutes: number
) {
  try {
    const expirationDate = new Date();
    expirationDate.setTime(
      expirationDate.getTime() + expirationMinutes * 60 * 1000
    );
    Cookies.set(cookieName, cookieValue, { expires: expirationDate });
  } catch {
    return false;
  }
}

export function deleteCookie(cookieName: string) {
  try {
    Cookies.remove(cookieName);
    return true;
  } catch {
    return false;
  }
}

//  setCookie("exampleCookie", "exampleValue", 7);
