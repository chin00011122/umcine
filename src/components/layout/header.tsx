export function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <a className="logo" href="#">
          <img src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </a>

        <nav className="nav">
          <a className="nav-link active" href="#movies">
            영화
          </a>
          <a className="nav-link" href="#bookmarks">
            북마크
          </a>
        </nav>

        <div className="header-actions">
          <button className="icon-button" type="button" aria-label="검색">
            <img src="/icons/search.svg" alt="" />
          </button>

          <button className="login-button" type="button">
            <img src="/icons/person.svg" alt="" />
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
