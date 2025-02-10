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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>HBA LOGO HERE</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={20} // Icon sizes
                        height={20}
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
