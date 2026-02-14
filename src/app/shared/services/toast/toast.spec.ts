import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [ToastService],
    });

    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('show', () => {
    it('should add a toast to the list', () => {
      expect(service.toasts()).toEqual([]);

      service.show('Hello', 'success');

      expect(service.toasts()).toHaveLength(1);
      expect(service.toasts()[0].message).toBe('Hello');
      expect(service.toasts()[0].type).toBe('success');
    });

    it('should default type to info', () => {
      service.show('Info message');

      expect(service.toasts()[0].type).toBe('info');
    });

    it('should add multiple toasts', () => {
      service.show('First', 'success');

      service.show('Second', 'error');

      expect(service.toasts()).toHaveLength(2);
      expect(service.toasts()[0].message).toBe('First');
      expect(service.toasts()[1].message).toBe('Second');
    });
  });

  describe('dismiss', () => {
    it('should remove a toast by id', () => {
      service.show('Toast to remove', 'info');
      const id = service.toasts()[0].id;

      service.dismiss(id);

      expect(service.toasts()).toEqual([]);
    });

    it('should only remove the targeted toast', () => {
      service.show('Keep', 'info');
      service.show('Remove', 'error');
      const removeId = service.toasts()[1].id;

      service.dismiss(removeId);

      expect(service.toasts()).toHaveLength(1);
      expect(service.toasts()[0].message).toBe('Keep');
    });
  });

  describe('auto-dismiss', () => {
    it('should auto-dismiss after 3 seconds', () => {
      service.show('Auto dismiss', 'success');
      expect(service.toasts()).toHaveLength(1);

      vi.advanceTimersByTime(3000);

      expect(service.toasts()).toEqual([]);
    });
  });
});
