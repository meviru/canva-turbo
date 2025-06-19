const SidebarSettings = ({ selectedMenu }: { selectedMenu: any }) => {
    const RenderedComponent =
        selectedMenu?.component && typeof selectedMenu.component === "function"
            ? selectedMenu.component({ selectedMenu })
            : selectedMenu?.component;

    return <div className="w-[360px] h-screen border-r dark:border-white/10">{RenderedComponent}</div>;
};

export default SidebarSettings;
