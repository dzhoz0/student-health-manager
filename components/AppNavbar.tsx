"use client";

import {
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
} from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppNavbar() {
    const pathname = usePathname();

    return (
        <Navbar>
            <NavbarBrand as={Link} href="/">
                <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                    Student health manager 🏥
                </span>
            </NavbarBrand>

            <NavbarToggle />

            <NavbarCollapse>
                <NavbarLink as={Link} href="/" active={pathname === "/"}>
                    Home
                </NavbarLink>

                <NavbarLink
                    as={Link}
                    href="/students"
                    active={pathname.startsWith("/students")}
                >
                    Students
                </NavbarLink>

                <NavbarLink
                    as={Link}
                    href="/health-records"
                    active={pathname.startsWith("/health-records")}
                >
                    Health records
                </NavbarLink>
            </NavbarCollapse>
        </Navbar>
    );
}
