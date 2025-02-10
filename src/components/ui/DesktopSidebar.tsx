import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Menu items with image paths.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: "/icons/Home.png",
  },
  {
    title: "Inbox",
    url: "#",
    icon: "/icons/Check Inbox.png",
  },
  {
    title: "Update Information",
    url: "#",
    icon: "/icons/Change.png",
  },
  {
    title: "Application",
    url: "#",
    icon: "/icons/Application Form.png",
  },
];

export default function DesktopSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent style={{ position: "relative" }}>
        {/* Sidebar Collapse Button in the Top-Right */}
        <SidebarTrigger
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 10, // Ensure it stays above other elements
          }}
        ></SidebarTrigger>

        {/* Logo at the top of the sidebar */}
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Image
            src="/logo/HBA_NoBack_NoWords.png" // Logo
            alt="Logo"
            width={1200} // Adjust size as needed
            height={1200} // Adjust size as needed
          />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Blank item to create space */}
              <SidebarMenuItem>
                <div style={{ height: "40px" }} /> {/* You can adjust height for spacing */}
              </SidebarMenuItem>

              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={20} // Icon size
                        height={20} // Icon size
                      />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
