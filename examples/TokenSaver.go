type TokenSaver interface {
    Save(*oauth2.Token) error
}

func newCachedTokenSource(src oauth2.TokenSource, ts TokenSaver) oauth2.TokenSource {
    return &cachedTokenSource{
        pts: src,
        ts:  ts,
    }
}

type cachedTokenSource struct {
    pts oauth2.TokenSource // called when t is expired.
    ts  TokenSaver
}

func (s *cachedTokenSource) Token() (*oauth2.Token, error) {
    t, err := s.pts.Token()
    if err != nil {
        return nil, err
    }
    if err := s.ts.Save(t); err != nil {
        return nil, err
    }
    return t, nil
}

// example stolen from @rakyll ;)
func Example_tokenCache() {
    conf := &oauth2.Config{
        ClientID:     "YOUR_CLIENT_ID",
        ClientSecret: "YOUR_CLIENT_SECRET",
        Scopes:       []string{"SCOPE1", "SCOPE2"},
        Endpoint: oauth2.Endpoint{
            AuthURL:  "https://provider.com/o/oauth2/auth",
            TokenURL: "https://provider.com/o/oauth2/token",
        },
    }

    var tok *oauth2.Token // nil or restored token
    ts := conf.TokenSource(oauth2.NoContext, tok)
    tokenSaver := newTokenSaver() // here goes actuall implementation of TokenSaver interface
    cts := newCachedTokenSource(ts, tokenSaver)
    client := oauth2.NewClient(oauth2.NoContext, cachedTokenSource)
    client.Get("...")
}
