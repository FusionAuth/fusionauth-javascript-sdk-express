export const cookieHelpers = {
  setSecure: function (res, name, value, maxAge = undefined) {
    const cookieProps = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    };
    if (typeof maxAge !== 'undefined') {
      cookieProps['maxAge'] = maxAge;
    }
    res.cookie(name, value, cookieProps);
  },

  setReadable: function (res, name, value, maxAge = undefined) {
    const cookieProps = {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
    };
    if (typeof maxAge !== 'undefined') {
      cookieProps['maxAge'] = maxAge;
    }
    res.cookie(name, value, cookieProps);
  },
};
