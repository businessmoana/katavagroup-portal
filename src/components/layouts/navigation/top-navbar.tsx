import { SearchIcon } from '@/components/icons/search-icon';
import LanguageSwitcher from '@/components/layouts/navigation/language-switcher';
import MessageBar from '@/components/layouts/topbar/message-bar';
import RecentOrderBar from '@/components/layouts/topbar/recent-order-bar';
import SearchBar from '@/components/layouts/topbar/search-bar';
import StoreNoticeBar from '@/components/layouts/topbar/store-notice-bar';
import VisitStore from '@/components/layouts/topbar/visit-store';
import Alert from '@/components/ui/alert';
import CountdownTimer from '@/components/ui/countdown-timer';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import Logo from '@/components/ui/logo';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { Config } from '@/config';
import { Routes } from '@/config/routes';
import { useUI } from '@/contexts/ui.context';
import { useSettingsQuery } from '@/data/settings';
import { useShopQuery } from '@/data/shop';
import { useMeQuery } from '@/data/user';
import {
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import {
  RESPONSIVE_WIDTH,
  checkIsMaintenanceModeComing,
  checkIsMaintenanceModeStart,
  miniSidebarInitialValue,
  searchModalInitialValues,
} from '@/utils/constants';
import cn from 'classnames';
import { isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useWindowSize } from 'react-use';
import AuthorizedMenu from './authorized-menu';

export const isInArray = (array: Date[], value: Date) => {
  return !!array?.find((item) => {
    return item?.getDate() == value?.getDate();
  });
};

const Navbar = () => {
  const { t } = useTranslation();
  const { toggleSidebar } = useUI();
  const { permissions } = getAuthCredentials();
  const { enableMultiLang } = Config;
  const { locale, query } = useRouter();
  const { data } = useMeQuery();
  const { openModal } = useModalAction();
  const [searchModal, setSearchModal] = useAtom(searchModalInitialValues);
  const [miniSidebar, setMiniSidebar] = useAtom(miniSidebarInitialValue);
  const [isMaintenanceMode, setUnderMaintenance] = useAtom(
    checkIsMaintenanceModeComing,
  );
  const [isMaintenanceModeStart, setUnderMaintenanceStart] = useAtom(
    checkIsMaintenanceModeStart,
  );
  function handleClick() {
    openModal('SEARCH_VIEW');
    setSearchModal(true);
  }

  return (
    <header className="fixed top-0 z-40 w-full bg-white shadow">
      <nav className="flex items-center px-5 md:px-8">
        <div className="relative flex w-full flex-1 items-center">
          <div className="flex items-center">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={toggleSidebar}
              className="group flex h-5 w-5 shrink-0 cursor-pointer flex-col justify-center space-y-1 me-4 focus:text-accent focus:outline-none lg:hidden"
            >
              <span
                className={cn(
                  'h-0.5 rounded-full bg-gray-600 transition-[width] group-hover:bg-accent',
                  miniSidebar ? 'w-full' : 'w-2/4',
                )}
              />
              <span className="h-0.5 w-full rounded-full bg-gray-600 group-hover:bg-accent" />
              <span className="h-0.5 w-3/4 rounded-full bg-gray-600 transition-[width] group-hover:bg-accent" />
            </motion.button>
            <div
              className={cn(
                'flex h-16 shrink-0 transition-[width] duration-300 me-4 lg:h-[76px] lg:border-solid lg:border-gray-200/80 lg:me-8 lg:border-e',
                miniSidebar ? 'lg:w-[65px]' : 'lg:w-[230px]',
              )}
            >
              <Logo />
            </div>
            <button
              className="group hidden h-5 w-5 shrink-0 cursor-pointer flex-col justify-center space-y-1 me-6 lg:flex"
              onClick={() => setMiniSidebar(!miniSidebar)}
            >
              <span
                className={cn(
                  'h-0.5 rounded-full bg-gray-600 transition-[width] group-hover:bg-accent',
                  miniSidebar ? 'w-full' : 'w-2/4',
                )}
              />
              <span className="h-0.5 w-full rounded-full bg-gray-600 group-hover:bg-accent" />
              <span
                className={cn(
                  'h-0.5 rounded-full bg-gray-600 transition-[width] group-hover:bg-accent',
                  miniSidebar ? 'w-full' : 'w-3/4',
                )}
              />
            </button>
          </div>
          <div className="relative hidden w-full max-w-[710px] py-4 me-6 lg:block 2xl:me-auto">
            <SearchBar />
          </div>
          <AuthorizedMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
