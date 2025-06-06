"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutFunction } from "@/services/auth";
import { Edit, Edit2, ListOrderedIcon, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { ChangeMyPassword } from "../auth/changeMyPassword";
import { UpdateUserData } from "../auth/UpdateUserData";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export const UserMenu = ({ showName = false }) => {
  const [openUpdateDataDialog, setOpenUpdateDataDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userStorage = Cookies.get("user");
  const user = userStorage ? JSON.parse(userStorage) : null;
  const router = useRouter();
  const t = useTranslations("Header.user");

  const handleOrdersClick = () => {
    setDropdownOpen(false);
    router.push("/allorders");
  };

  const handlePasswordClick = () => {
    setDropdownOpen(false);
    setOpenPasswordDialog(true);
  };

  const handleUserDataClick = () => {
    setDropdownOpen(false);
    setOpenUpdateDataDialog(true);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src="/images/avatar.jpg" />
              <AvatarFallback>AA</AvatarFallback>
            </Avatar>
            {showName && user && (
              <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
                {user.name}
              </span>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="text-muted-foreground">
            {t("welcome", { name: user ? user.name.split(" ")[0] : "Guest" })}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={handleOrdersClick}
          >
            <ListOrderedIcon size={16} />
            {t("myOrders")}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={handleUserDataClick}
          >
            <Edit2 size={16} />
            {t("editProfile")}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={handlePasswordClick}
          >
            <Edit size={16} />
            {t("updatePassword")}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer gap-2 text-red-500"
            onClick={LogoutFunction}
          >
            <LogOut size={16} />
            {t("signOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateUserData
        open={openUpdateDataDialog}
        onOpenChange={setOpenUpdateDataDialog}
      />
      <ChangeMyPassword
        open={openPasswordDialog}
        onOpenChange={setOpenPasswordDialog}
      />
    </>
  );
};
