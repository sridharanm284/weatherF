function HeaderTitle(props: { name: string }) {
    return props.name ? (
        <div className="header-title-topbar">
            <div className="flex flex-space-between flex-middle h-100">
                <h4>{props.name}</h4>
            </div>
        </div>) : null
}
export default HeaderTitle;
